import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/UpdateProfile.css'
import AlertContext from '../context/AlertContext'
import ALert from '../Alert'
const Login = () => {

    // using to accessed data without passing the props down manually to each level(component hierarch)
    const context = useContext(AlertContext);    // context API for custom alerts
    const { addAlert } = context;        // destructuring addAlert from AlertContext

    const [credentials, setCredentials] = useState({ email: "", password: "" })  // useState hook for credentials
    const [userType, setuserType] = useState("")       // useState hook for userType 
    let navigate = useNavigate();    // for navigation/page redirection

    //Function to handle form on submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // stops page reloading
        
        //API call to login seller/buyer/agent/admin as per given credentials
        const response = await fetch(
            `http://localhost:5000/api/auth/${userType}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            }
        );
        const json = await response.json();
        if (json.success) {
            // save the token and userType  then redirect
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', userType)
            addAlert({
                type: 'success',
                msg: 'Login Successfully'
            })

            navigate('/')
        }
        else {   // Wrong Credentials used
            addAlert({
                type: 'danger',
                msg: 'Invalid credential'
            })
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })   // setting state for credentials of logged in user
    }

    const onChangeType = (e) => {
        setuserType(e.target.value)    //Setting state for userType(whether it is seller,buyer,admin or agent)
    }

    return (
        <div>
            <ALert />

            <div className='update-container'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" value={credentials.email} name="email" aria-describedby="emailHelp"
                            onChange={onChange} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" value={credentials.password} name="password" className="form-control"
                            onChange={onChange} />
                    </div>
                    <select className="mb-3 form-select" aria-label="Default select example" onChange={onChangeType} required>
                        <option value="">Login as </option>
                        <option value="seller">Seller</option>
                        <option value="buyer">Buyer</option>
                        <option value="admin">Admin</option>
                        <option value="agent">Agent</option>
                    </select>

                    <button type="submit" className="btn btn-primary" >Submit</button>
                </form>

            </div>
        </div>
    )
}

export default Login