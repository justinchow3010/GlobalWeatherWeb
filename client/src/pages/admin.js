import React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
//import axios from 'axios'
import { instanceOf } from 'prop-types';
import { Form, Button, Modal } from "react-bootstrap";
import Logout from "../util/LogoutCall";
import Cookies from 'js-cookie';
import DisplayMap  from '../components/map';
export class AdminMainPage extends React.Component {
    
      constructor(props) {
        super(props);
    
        // const { Cookies } = props;
        this.state = {
          name: Cookies.get('username')
        };
        
      }
      
    render() {
        if(this.state.name!=="admin")
            return <Navigate to="/login"/> 
        return <>
            <div className='container'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand" >Welcome Admin!</a>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="locationadmin">Location</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="useradmin">User</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link justify-content-end" onClick={() => { Logout() }}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <Routes>
                        <Route path='' element={< UpdateData />}/>
                        <Route path='locationadmin' element={< LocationAdmin />}/>
                        <Route path='useradmin' element={< UserAdmin />}/>
                    </Routes>
            </div>
        </>;
    }
}

class UpdateData extends React.Component {

    requestUpdatedDataClick = () => {
        console.log('requestUpdatedDataClick is clicked!');
    }

    render() {
        return <>
            <div>
                Request updated data: <br />
                <button type="button" className="btn btn-primary" onClick={this.requestUpdatedDataClick}>
                    Update
                </button>
                <DisplayMap />
            </div>
        </>;
    }
}

function LocationAdmin() {
    const [data, getData] = useState([]);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch("http://34.204.136.172/api/location", {
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                getData(data);
            })
    }


    return (<>
        <div>
            <h1>Locations</h1>
            <CreateLocationForm />
            <table class="table table-bordered table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">locId</th>
                        <th scope="col">name</th>
                        <th scope="col">lat</th>
                        <th scope="col">long</th>
                        <th scope="col">comments</th>
                        <th scope="col">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i}>
                            <td>{item.locId}</td>
                            <td>{item.name}</td>
                            <td>{item.lat}</td>
                            <td>{item.long}</td>
                            <td>{item.comments}</td>
                            <td>
                                <UpdateLocationForm
                                    locId={item.locId}
                                    name={item.name}
                                    lat={item.lat}
                                    long={item.long}
                                />
                                <DeleteLocationForm
                                    locId={item.locId}
                                    name={item.name}
                                    lat={item.lat}
                                    long={item.long}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>);
}

function CreateLocationForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const createLocation = () => {
        console.log("Name", name);
        console.log("lat", lat);
        console.log("long", long);
        let data = JSON.stringify({
            name: name,
            lat: lat,
            long: long,
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        fetch('http://34.204.136.172/api/location', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));
        setShow(false);
    };


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create New Location
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" value={long} onChange={(e) => setLong(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createLocation}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function UpdateLocationForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.name);
    const [lat, setLat] = useState(props.lat);
    const [long, setLong] = useState(props.long);

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const updateLocation = () => {
        console.log("Name", name);
        console.log("lat", lat);
        console.log("long", long);
        let data = JSON.stringify({
            locId: props.locId,
            name: name,
            lat: lat,
            long: long,
        });
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        fetch('http://34.204.136.172/api/location', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));
        setShow(false);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Update
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update locId:{props.locId} Name:{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >locId</Form.Label>
                            <Form.Control type="text" placeholder="locId" defaultValue={props.locId} disabled />
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" value={long} onChange={(e) => setLong(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateLocation}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteLocationForm(props) {
    const [show, setShow] = useState(false);

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const deleteLocation = () => {
        console.log("locId", props.locId);
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('http://34.204.136.172/api/location/' + props.locId + '/', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));
        setShow(false);
    };


    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete locId:{props.locId} Name:{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >locId</Form.Label>
                            <Form.Control type="text" placeholder="locId" plaintext readOnly defaultValue={props.locId} />
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" plaintext readOnly defaultValue={props.name} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" plaintext readOnly defaultValue={props.lat} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" plaintext readOnly defaultValue={props.long} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteLocation}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function UserAdmin() {
    const [data, getData] = useState([]);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch("http://34.204.136.172/api/users", {
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                console.log(data)
                getData(data);
            })
    }


    return (<>
        <div>
            <h1>Users</h1>
            <CreateUserForm />
            <table class="table table-bordered table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">username</th>
                        <th scope="col">password</th>
                        <th scope="col">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i}>
                            <td>{item.username}</td>
                            <td>{item.password}</td>
                            <td>
                                <UpdateUserForm
                                    username={item.username}
                                    password={item.password}
                                />
                                <DeleteUserForm
                                    username={item.username}
                                    password={item.password}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>);
}

function CreateUserForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const createUser = () => {
        console.log("Name", name);
        console.log("Password", password);
        let data = JSON.stringify({
            newname: name,
            newpw: password,
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        fetch('http://34.204.136.172/api/users', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));
        setShow(false);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create New User
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createUser}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function UpdateUserForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.username);
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const updateUser = () => {
        console.log("New Name", name);
        console.log("New Password", password);
        let data = JSON.stringify({
            newname: name,
            newpw: password,
        });
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        fetch('http://34.204.136.172/api/users/' + props.username + '/', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));

        setShow(false);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Update
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="New Username" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateUser}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteUserForm(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate(); //for reload page after operation

    const deleteUser = () => {
        console.log("username", props.username);
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('http://34.204.136.172/api/users/' + props.username + '/', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
            })
            .then(navigate(0));
        setShow(false);
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Username:{props.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" plaintext readOnly defaultValue={props.username} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="Password" plaintext readOnly defaultValue={props.password} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}