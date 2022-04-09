import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/UpdateProfile.css'
import Alert from '../Alert'
import "../css/BackGround.css"
import AlertContext from '../context/AlertContext'

//Buyer Signup 
const SignUp = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" }) //UseState Hook for setting credentials of new buyer


    const context = useContext(AlertContext);   // context API for custom alerts
    const { addAlert } = context;       // destructuring addAlert from AlertContext

    //to navigate 
    const navigate = useNavigate();

    //Handle signUp form submit 
    const handleSubmit = async (e) => {
        e.preventDefault(); // to prevent loading of page on form submit
        const { name, email, password } = credentials;   // destructuring name,email and password from credential state

        // API call to store new buyer(with new details)
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
        const json = await response.json();   // getting response from server

        if (json.success) {
            // save the token and redirect
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', "buyer")
            addAlert({
                type: 'success',
                msg: 'Registered Successfully'
            })

            navigate('/')
        }
        else      // if some error is there or buyer(with passed credentials) already exists 
        {
            addAlert({
                type: 'danger',
                msg: json.error
            })
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })   // setting state of credentials of buyer
    }
    return (
        <div className='backGround'>
            <Alert />
            <div className='update-container' style={{ width: '40%' }}>
                <h3 style={{ marginLeft: '30%', margintBottom: "50px" }}>SignUp Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3" style={{ marginBottom: '30px' }}>
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                            id="name" name="name" />
                    </div>
                    <div className="mb-3" style={{ marginBottom: '30px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                            id="email" name="email" />
                    </div>
                    <div className="mb-3" style={{ marginBottom: '30px' }}>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={onChange}
                            id="password" name="password" minLength={5} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', marginLeft: '40%' }}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp