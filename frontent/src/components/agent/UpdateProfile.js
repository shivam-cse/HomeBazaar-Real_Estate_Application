import React, { useState, useContext } from 'react';
import '../css/UpdateProfile.css'
import AlertContext from '../context/AlertContext'
import { useNavigate, useLocation } from 'react-router-dom';

export default function UpdateProfile() {
    const location = useLocation()
    const { userDetails } = location.state

    //it is for handle the state of updateProfile
    const [updateProfile, setupdateProfile] = useState({name:userDetails.name, number:userDetails.contact, area:userDetails.area, charges:userDetails.charges});
    const context = useContext(AlertContext);
    const {  addAlert } = context;
    //to navigate 
    const navigate = useNavigate();
    const host = "http://localhost:5000";
    
    //function to update profile
    const handleUpdateProfile = async (e) => {
        //this is to do not reload our page
        e.preventDefault();
        
        //API call to update the profile our users
        const response = await fetch(`${host}/api/auth/agent/update`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({name:updateProfile.name, workingArea:updateProfile.area, contactNumber:UpdateProfile.number, charges:updateProfile.charges}) // body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            addAlert({
                type: 'success',
                msg: 'Profile Updated Successfully'
            })
            navigate('/agent/dashboard')
            
        }
        else{ 
            addAlert({
                type: 'danger',
                msg: json.error
            })
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
                        <label htmlFor="name" className="form-label ">Name</label>
                        <input type="text" className="form-control" id="name" name='name'  value={updateProfile.name}  onChange={onChange}  placeholder="Shivam sahu" required minLength={3} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="number" className="form-label ">Contact Number</label>
                        <input type="text" className="form-control" id="number" name='number'  value={updateProfile.number} onChange={onChange}  placeholder="9026878655" required minLength={10} maxLength={10} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="area" className="form-label ">Working Area</label>
                        <input type="text" className="form-control" id="area" name='area'  value={updateProfile.area} onChange={onChange}  placeholder="Lucknow" required minLength={3} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="charges" className="form-label ">Charges</label>
                        <input type="text" className="form-control" id="charges" name='charges' value={updateProfile.charges}  onChange={onChange}  placeholder="5000" required minLength={2} />
                    </div>
                    <button type="submit" className="btn btn-success" >Update</button>
                </div>
            </form>
        </>
    )
}
