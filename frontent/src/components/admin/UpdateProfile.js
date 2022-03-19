import React, { useState } from 'react';
import '../css/Dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom';

export default function UpdateProfile() {

    const location = useLocation()
    const { userDetails } = location.state

    //it is for handle the state of updateProfile
    const [updateProfile, setupdateProfile] = useState({name:userDetails.name});
    
    //to navigate 
    const navigate = useNavigate();
    const host = "http://localhost:5000";
    
    //function to update profile
    const handleUpdateProfile = async (e) => {
        //this is to do not reload our page
        e.preventDefault();
        
        //API call to update the profile our users
        const response = await fetch(`${host}/api/auth/admin/update`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({name:updateProfile.name}) // body data type must match "Content-Type" header
        });
        const json = await response.json();
        // console.log(json);
        if(json.success){
            navigate('/admin/dashboard')
            alert("Updated Profile")
        }
        else{

            alert("Not updated")
        }
    }
    const onChange = (e) => {
        // console.log("onchange", name);
        setupdateProfile({ ...updateProfile, [e.target.name]: e.target.value })
    }
    
    return (
        <>
            <form onSubmit={handleUpdateProfile}>
                <div className='update-container'>
                <div className='update-top bg-primary text-white'>Update Your Details </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter Name</label>
                        <input type="text" className="form-control" id="name" name='name' value={updateProfile.name} onChange={onChange}  placeholder="Shivam sahu" required minLength={3} />
                    </div>
                    <button type="submit" className="btn btn-success" >Update</button>
                </div>
            </form>
        </>
    )
}
