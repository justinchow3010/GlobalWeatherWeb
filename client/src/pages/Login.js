import 'bootstrap/dist/css/bootstrap.min.css'
import { Component, useState } from 'react';
import {Navigate, Route, useNavigate} from 'react-router-dom';
import UserPage from './UserPage';
import { AdminMainPage } from './admin';
const Login = () => {
    const [role, setRole] = useState(null);
    const [isWrong, setWrong] = useState(false);
    const navigate = useNavigate();
    const ErrorMessage =()=>{
        return <p className='text-danger'>Wrong Username or Password</p>;
    }
    function onClickLogin(event){
        
        event.preventDefault();
        // const [username, setUsername] = useState("");
        // const [password, setPassword] = useState("");
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const data = "username="+username+"&password="+password;
        if(username!=="" && password!==""){
            fetch("/api/login", {
                method: "POST",
                credentials: 'include',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body : data
            })
            .then(res=>res.json())
            .then(data=>{
                // console.log(data)
                 console.log(data.user, typeof(data.user))

                if(data.user == "admin"){
                    console.log("called")
                    navigate('/admin')
                }
                else if(data.user=="Login Failed" || data.user ==="Wrong username or password")
                     setWrong(true);
                else  navigate('/user')

            })
        }
        else {
            setWrong(true);
            console.log(isWrong)
        }
         setRole("user");
        console.log(role);

        // if(role === "user"){
            // return <Navigate to="/user"/>
        // }

    };


    return( 
        
  
    
    <div className="bg-dark container-fluid vh-100">
        <div className="card bg-light mx-auto text-dark" style={{"width": "50rem"}}>
            {role && (
                <Navigate to="/user" replace={true} Component={UserPage} />
            )}
            <div className="card-header">Login</div>
            <div className="card-body">
                {isWrong?<ErrorMessage/>:<div></div>}
                <form onSubmit={onClickLogin}>
                    <div className="form-group my-3">
                        <label htmlFor="username">User name</label>
                        <input type="text" name="username" className="form-control" id="username" placeholder="User name" />
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" id="password" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">Submit</button>
                </form>
            </div>
        </div>
    </div >)
};

export default Login;