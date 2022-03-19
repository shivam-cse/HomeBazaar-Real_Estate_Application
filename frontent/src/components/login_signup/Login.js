import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/UpdateProfile.css'
const Login = () => {

    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [userType, setuserType] = useState("")
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        console.log(json);
        if (json.success) {
            // save the token and redirect
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', userType)
            navigate('/')
        }
        else {
            alert("Invalid Credentials !")
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const onChangeType = (e) => {
        setuserType(e.target.value)
    }

    return (
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
    )
}

export default Login