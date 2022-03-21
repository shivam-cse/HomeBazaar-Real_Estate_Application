import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/UpdateProfile.css'
import Alert from '../Alert'
import AlertContext from '../context/AlertContext'
const SignUp = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })

    // using to accessed data without passing the props down manually to each level(component hierarch)
    const context = useContext(AlertContext);
    const { alert, addAlert } = context;

    //to navigate 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch(
            'http://localhost:5000/api/auth/buyer/signup',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password }),
            }
        );
        const json = await response.json();
        console.log("hhh", json);
        // save the token and redirect
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', "buyer")
            addAlert({
                type: 'success',
                msg: 'Registered Successfully'
            })

            navigate('/')
        }
        else {
            addAlert({
                type: 'danger',
                msg:json.error
            })
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div><Alert />
        <div className='update-container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                        id="name" name="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                        id="email" name="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange}
                        id="password" name="password" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </div>
    )
}

export default SignUp