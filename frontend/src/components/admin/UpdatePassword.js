import React, { useState, useContext } from 'react'
import '../css/Dashboard.css'
import { useNavigate } from 'react-router-dom';
import AlertContext from '../context/AlertContext'
import ALert from '../Alert';

export default function UpdatePassword() {
    
    const host = "http://localhost:5000";  // HOST

    //it is for handle the state of updated Password
    const [updatePassword, setupdatePassword] = useState({ oldPassword: "", newPassword: "", cnewPassword: "" });

    const context = useContext(AlertContext);  // context API for custom alerts
    
    const { addAlert } = context;  // destructuring addAlert from AlertContext
    //to navigate page
    const navigate = useNavigate();

    //function to update user's password
    const handleUpdatePassword = async (e) => {
        //avoid page reloading 
        e.preventDefault();

        //if the user entered new password is not same
        if (updatePassword.cnewPassword !== updatePassword.newPassword) {
            addAlert({
                type: 'danger',
                msg: 'New password and confirm password didnot matched'
            })
            return;
        }
        //API call to update the password of our user
        const response = await fetch(`${host}/api/auth/admin/updatePassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ oldPassword: updatePassword.oldPassword, newPassword: updatePassword.newPassword }) // body data type must match "Content-Type" header
        });

        const json = await response.json();
      
        if (json.success) {
            addAlert({
                type: 'success',
                msg: 'Password Updated Successfully'
            })
            navigate('/admin/dashboard')
        }
        else {
            addAlert({
                type: 'danger',
                msg: json.error
            })
        }
    }

    const onChange = (e) => {
        setupdatePassword({ ...updatePassword, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ALert />
            <form onSubmit={handleUpdatePassword}>
                <div className='update-container'>
                    <div className='update-top bg-primary text-white'>Update Your Password </div>
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">Enter old password</label>
                        <input type="password" className="form-control" id="oldPassword" value={updatePassword.oldPassword} name='oldPassword' placeholder="password" onChange={onChange} required minLength={5} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">Enter new password</label>
                        <input type="password" className="form-control" id="newPassword" value={updatePassword.newPassword} name='newPassword' placeholder="new password" onChange={onChange} required minLength={5} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cnewPassword" className="form-label">Enter new password (again)</label>
                        <input type="password" className="form-control" id="cnewPassword" value={updatePassword.cnewPassword} name='cnewPassword' placeholder="confirm new password" onChange={onChange} required minLength={5} />
                    </div>
                    <button type="submit" className="btn btn-success" >Update</button>
                </div>
            </form>
        </>
    )
}
