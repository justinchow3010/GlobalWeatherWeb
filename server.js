const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const path = require('path')
const fs = require('fs');
const app = express();
const crypto = require('crypto');
const cors = require('cors');
const moment = require('moment-timezone');
const cookieParser = require('cookie-parser');
const { equal } = require('assert');
const Schema = mongoose.Schema;
const WeatherAPIKey = "d3b33766ea504d08880144345222704";
const serverURL = 'mongodb://localhost/new';
mongoose.connect(serverURL);

const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

db.on("error", console.error.bind(console, 'Connection error:'));

db.once("open", () => {
    console.log("Connnected");
    const UserSchema = Schema({
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        favlocs: [{ type: Schema.Types.ObjectId, ref: "Location" }]
    });

    const LocationSchema = Schema({
        locId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        long: { type: Number, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    });

    const CommentSchema = Schema({
        cId: { type: Number, required: true, unique: true },
        username: { type: String, required: true },
        content: { type: String }
    });

    const User = mongoose.model("User", UserSchema);
    const Location = mongoose.model("Location", LocationSchema);
    const Comment = mongoose.model("Comment", CommentSchema);

    const checkIsAdmin = (session) => {
        console.log(session);
        // return true;
        if (session.username == "admin") return true;
        return false;
    };

    const hashPassword = (password) => {
        let salt = crypto.randomBytes(16).toString("hex");
        let iterations = 1000;
        let hash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512");
        return {
            salt: salt,
            hash: hash,
            iterations: iterations
        };
    };

    const validatePassword = (hash, salt, password) => {
        return hash == crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512");
    }

    app.use(session({
        secret: 'getsessiontime',
        cookie: { maxAge: 300000, },
        resave: true,
        saveUninitialized: true,

    }));

    app.use(cookieParser());

    // Server log in Node
    logger.token("date", (req, res, tz) => {
        return moment().tz(tz).format();
    });

    logger.format("myformat", 'IP [:remote-addr]\nBrower Information [:user-agent]\nDate and Time [:date[Asia/Hong_Kong]]\nRequest method and URL [:method :url :status]\n');

    app.use(logger('myformat', {
        stream: fs.createWriteStream('./server_log.log', { flags: 'a' })
    }));

    app.use(bodyParser.json());

    // login -> check user / admin -> add username to cookie
    app.post("/api/login", (req, res) => {
        // req.session.username
        console.log(req.session);
        console.log(req.body)
        User.findOne({ username: req.body['username'] }, (err, user) => {
            if (err || !user) {
                res.send("Login Failed");
                return;
            } else {
                if (validatePassword(user.password, user.salt, req.body.password)) {
                    // if(!req.session.username )
                    req.session.username = user.username;
                    res.cookie('username', user.username, { maxAge: 300000 });

                    // req.cookies.username = user.username;
                    res.set('Content-Type', 'text/plain');
                    // res.set("Access-Control-Allow-Origin", "*"),
                    // res.set("Access-Control-Allow-Credentials", true );
                    res.send({ "user": user.username });
                    // res.send("Success");
                    console.log(req.session);
                }
                else {
                    res.status(404).send("Wrong username or password");
                    return
                }
            }

        });
    });

    // logout -> expire the cookie
    app.post("/api/logout", (req, res) => {
        res.clearCookie('username');
        req.session.destroy(() =>
            res.redirect("/")
        );
    });

    // return all fav locations
    app.get("/api/favloc", (req, res) => {
        // get username from cookie first
        const username = req.session.username;
        User.findOne({ username: username })
            .select("favlocs")
            .populate("favlocs")
            .exec((err, results) => {
                if (err || !results) {
                    res.status(404).send("Get locations failed!");
                    // handle error
                    return;
                } else {
                    res.send(results.favlocs);
                    return;
                }
            });
    });

    // add location to favourites
    app.post("/api/favloc/:locId", (req, res) => {
        // check Isuser
        if (checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }

        Location.findOne({ locId: req.params.locId })
            .select("_id")
            .exec((err, results) => {
                if (err || !results) {
                    // handle error
                    res.status(404).send("Add failed! ");
                } else {
                    User.findOne({ username: req.session.username }, (err, user) => {
                        if (err || !user) {
                            // handle error
                        } else {
                            user.favlocs = results._id;
                            user.save();
                            res.send("favloc added successfully");
                            return;
                        }
                    })
                }
            });
    });

    // return all locatioins
    app.get("/api/location", (req, res) => {
        console.log('Now start return all locations');
        console.log(req.session);
        Location.find()
            .populate("comments")
            .exec((err, results) => {
                if (results.length >= 0 || !err) {
                    console.log('Now return all locations');
                    res.send(results);

                } else {
                    // handle eror
                    console.log('Now return all locations have error');
                    res.status(404).send("error ocurrs in getting locations");
                    return;
                }
            });
    });

    // return specific locatioins
    app.get("/api/location/:id", (req, res) => {
        Location.findOne({ locId: req.params.id })
            .populate("comments")
            .exec((err, results) => {
                if (!results || err) {
                    // handle error
                } else {
                    res.send(results);
                    return;
                }
            });
    });

    // create location (admin)
    app.post("/api/location", (req, res) => {
        // check Isadmin (added back later)
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        const body = req.body;
        console.log(body);
        Location.findOne()
            .sort('-locId')
            .exec((err, results) => {
                let largestId = 1;
                if (results) {
                    largestId = results.locId + 1;
                }
                Location.create({
                    locId: largestId,
                    name: body.name,
                    lat: body.lat,
                    long: body.long
                }, (err, results) => {
                    if (err || !results) {
                        res.status(404).send("Create location failed!");
                        return;
                        // handle error
                    } else {
                        res.send("Successfully added.");
                        // return;
                    }
                });
            });

    });

    // update location (admin)
    app.put("/api/location/", (req, res) => {
        // check Isadmin (added back later)
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        const body = req.body;
        console.log(body);
        Location.findOne({ locId: body.locId }, (err, results) => {
            if (err || !results) {
                // handle error
                res.status(404).send("Update location failed!");
                return;
            } else {
                if (body.name) {
                    results.name = body.name;
                }
                if (body.lat) {
                    results.lat = body.lat;
                }
                if (body.long) {
                    results.long = body.long;
                }
                results.save((err, results) => {
                    if (err || !results) {
                        // handle error
                        res.status(404).send("Update location failed!");
                        return;
                    } else {
                        res.send("Updated.");
                        return;
                    }
                });
            }
        });
    });

    // delete location (admin)
    app.delete("/api/location/:locId", (req, res) => {
        if (!checkIsAdmin(req.session)) {
            res.send("Access denied");
            return;
        }
        Location.deleteOne({ locId: req.params.locId }, (err, results) => {
            if (err || !results) {
                res.send("Delete failed");
                return;
            } else {
                res.send("Deleted.");
                return;
            }
        });
    });

    // get all comments for a specific location
    app.get("/api/comment/:locId", (req, res) => {
        Location.find({ locId: req.params.locId })
            .populate("comments")
            .exec((err, results) => {
                if (err || !results) {
                    res.status(404).send("Delete failed");
                    return;
                }
                else
                    res.send(results.comments)
            });
    });

    // add comment to a location
    app.post("/api/comment/:locId", (req, res) => {
        //require commentID, username, content and locationID
        const body = req.body;
        console.log(body);
        Comment.findOne()
            .sort('-cId')
            .exec((err, results) => {
                let largestId = 1;
                if (results) {
                    largestId = results.cId + 1;
                }
                Comment.create({
                    cId: largestId,
                    username: req.body.username,
                    content: req.body.content
                }, (err, comment) => {
                    if (err) {
                        res.status(404).send("Create failed!");
                        return;
                    }
                    Location.findOne({ locId: req.params.locId }, (err, location) => {
                        if (err || !results) {
                            // handle error
                            res.status(404).send("Create failed2!");
                            return;
                        } else {
                            if (comment) {
                                location.comments.push(comment._id);
                            }
                            location.save((err, save) => {
                                if (err || !save) {
                                    // handle error
                                    res.status(404).send("Add comment failed!");
                                    return;
                                } else {
                                    res.send(comment);
                                    return;
                                }
                            });
                        }
                    });
                })
            });
    });

    // return all users (admin)
    app.get("/api/users", (req, res) => {
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            console.log(req.session)

            return;
        }
        User.find((err, results) => {
            if (err || results == null) {
                res.send("Get faield");
            }
            res.send(results);
            return;
        });
    });

    // return specific users (admin)
    app.get("/api/users/:username", (req, res) => {
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        User.findOne({ username: req.params.username }, (err, results) => {
            if (err || results == null) {
                res.send("Get faield");
            }
            res.send(results);
            return;
        });
    });

    // create users (admin)
    app.post("/api/users", (req, res) => {
        console.log('create user');
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        const hashedObj = hashPassword(req.body['newpw']);
        User.create({
            username: req.body['newname'],
            password: hashedObj.hash,
            salt: hashedObj.salt
        }, (err, user) => {
            if (err || !user) {
                res.send("Create Failed");
            }
            // reply with the new created user
            else
                res.send("User " + user.username + " created");
            return;
        });
    });

    // update users (admin)
    app.put("/api/users/:username", (req, res) => {
        console.log('update one user');
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        User.findOne({ username: req.params.username }, (err, user) => {
            if (err || !user) {
                res.status(404).send("User not found");
                return;
            }
            console.log(req.body)
            if (req.body['newname']) {
                user.username = req.body['newname'];
            }
            if (req.body['newpw']) {
                user.password = crypto.pbkdf2Sync(req.body['newpw'], user.salt, 1000, 64, "sha512");
            }
            if (req.body['newfavlocs']) {
                user.favlocs = req.body['newfavlocs'];
            }
            user.save((err, save) => {
                if (err || !save) {
                    res.status(404).send("Update user failed!");
                    return;
                } else {
                    res.send("Updated");
                    return;
                }
            });
            // user.save()
            //     .then(
            //         savedUser => {
            //             res.send("User " + user.username + " created!");
            //         }
            //     )
            //     .catch(err => {
            //         console.log("Error while update user", err);
            //         res.send(err);
            //     });
        });
    });

    // delete one user (admin)
    app.delete("/api/users/:username", (req, res) => {
        console.log("Delete one user");
        if (!checkIsAdmin(req.session)) {
            res.status(404).send("Access failed");
            return;
        }
        User.deleteOne({ username: req.params['username'] }, (err, count) => {
            if (count.deletedCount == 1) {
                //if deleted one event succesfully send a respond with status code 204
                //nothing is in the response body
                res.status(204).send('delete sucessful');
            } else {
                res.status(404).send('Error, not found in database');
                return
            }
        });
    });
    // app.get("*", (req, res)=>{
    //     // res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    //     res.send("catch");
    // })
    app.all("/api/*", (req, res) => {
        res.send("Final catch");
    });

    //app.use(express.static(path.join(__dirname, "./client/public")));
    //if (process.env.NODE_ENV === 'production') {
    const root = path.join('app')
    app.use(express.static(root));
    app.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    })
    //app.use("*", express.static("app"));
    //}
});



// listen to port 3000
const server = app.listen(80);
// const server = app.listen(3000);

