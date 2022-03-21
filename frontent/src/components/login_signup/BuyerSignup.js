import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/UpdateProfile.css'
const SignUp = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
    
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
        console.log(json);
        // save the token and redirect
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', "buyer")
            alert('Registration Successful')
            navigate('/')
        }
        else {
            // props.showAlert("Invalid details", "danger")
            alert(json.error)
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
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
    )
}

export default SignUp