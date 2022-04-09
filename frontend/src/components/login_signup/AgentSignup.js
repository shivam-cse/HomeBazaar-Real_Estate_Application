import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/UpdateProfile.css'
import Alert from '../Alert'
import "../css/BackGround.css"
import AlertContext from '../context/AlertContext'
const AgentSignUp = () => {

    //UseState Hook for setting credentials of new agent
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", workingArea: "", charges: "", contactNumber: "" })


    const context = useContext(AlertContext);   // context API for custom alerts
    const {  addAlert } = context;       // destructuring addAlert from AlertContext

    let navigate = useNavigate();             // for page navigation

    // Handling form submit of agent Signup
    const handleSubmit = async (e) => {

        e.preventDefault();   // to prevent loading of page on form submit

        // destructuring name,email ,password,workingArea,charges,contactNumber from credential state
        const { name, email, password, workingArea, charges, contactNumber } = credentials;

        let areaNEW = workingArea.toLowerCase();    // converting working area of agent in lowercase before insertion in db 

        // API call for new agent registration/signup
        const response = await fetch(
            'http://localhost:5000/api/auth/agent/signup',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, workingArea: areaNEW, charges, contactNumber }),
            }
        );
        const json = await response.json();    // getting response 

        if (json.success) {
            // save the token and redirect
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('userType', "agent")
            addAlert({
                type: 'success',
                msg: 'Registered Successfully'
            })
            navigate("/")
        }
        else    // if some error is there or agent(with passed credentials) already exists 
        {
            addAlert({
                type: 'danger',
                msg: json.error
            })
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })   // setting state of credentials 
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
                        <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                        <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                            id="contactNumber" name="contactNumber" />
                    </div>
                    <div className="mb-3" style={{ marginBottom: '30px' }}>
                        <label htmlFor="workingArea" className="form-label">Area</label>
                        <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                            id="workingArea" name="workingArea" />
                    </div>
                    <div className="mb-3" style={{ marginBottom: '30px' }}>
                        <label htmlFor="charges" className="form-label">Charges</label>
                        <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                            id="charges" name="charges" />
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

export default AgentSignUp