import React, { useState, useContext } from 'react';
import '../css/Dashboard.css'
import { useNavigate, useLocation } from 'react-router-dom';
import AlertContext from '../context/AlertContext'
import "../css/BackGround.css"
import ALert from '../Alert'

export default function UpdateProfile() {
    const host = "http://localhost:5000";

    //useLocation for getting userDetails through link
    const location = useLocation()
    const { userDetails } = location.state  //
    //it is for handle the state of updateProfile
    const [updateProfile, setupdateProfile] = useState({ name: userDetails.name });
    const context = useContext(AlertContext);
    const { addAlert } = context; // Destructuring alert and addAlert  from context api
    //to navigate  page
    const navigate = useNavigate();

    //function to update profile
    const handleUpdateProfile = async (e) => {
        //this is to do not reload our page
        e.preventDefault();

        //API call to update the profile our users
        const response = await fetch(`${host}/api/auth/seller/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ name: updateProfile.name }) // body data type must match "Content-Type" header
        });
        const json = await response.json();
        if (json.success) {
            addAlert({
                type: 'success',
                msg: 'Profile Updated Successfully'
            })
            navigate('/seller/dashboard')
        }
        else {
            addAlert({
                type: 'danger',
                msg: json.error
            })
        }
    }
    const onChange = (e) => {
        setupdateProfile({ ...updateProfile, [e.target.name]: e.target.value })
    }


    return (
        <div className='backGround'>
            <ALert />
            <form onSubmit={handleUpdateProfile}>
                <div className='update-container'>
                    <div className='update-top bg-primary text-white'>Update Your Details </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter Name</label>
                        <input type="text" className="form-control" id="name" name='name' value={updateProfile.name} onChange={onChange} placeholder="Shivam sahu" required minLength={3} />
                    </div>
                    <button type="submit" className="btn btn-success" style={{ marginTop: '20px', marginLeft: '40%' }}>Update</button>
                </div>
            </form>
        </div>
    )
}
