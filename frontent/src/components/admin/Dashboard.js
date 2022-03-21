import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'
import { NavLink } from 'react-router-dom';
export default function Dashboard() {
    const host = "http://localhost:5000";

    //state for userDetails.
    const [userDetails, setuserDetails] = useState({ name: "", email: "" })
   //function to get loggined user's details
    const getUserDetails = async (e) => {
        //API call to get  users details
        const response = await fetch(`${host}/api/auth/admin/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },

        });
        const json = await response.json();
        
        if (json.success) {
            setuserDetails({ name: json.user.name, email: json.user.email })
        }
        else {
            alert("Your credentails is not valid. please try to login again!")
        }

    }

    //Runs only on the first render page to get user data
    useEffect(() => {
        getUserDetails();
        
    }, [])

    //function to capitalize any string
    function capitalize(name) {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
      }
    return (
        <>
            <div className='dashboard-top bg-primary text-white'>Dashboard </div>
            <NavLink to="/buyer/chat" className="chat"><i className="chat-icon fab fa-rocketchat" ></i></NavLink>
            <div className='dashboard'>
                <div className="row">
                    <div className="col-sm-5">
                        <div className='profile'>
                            <div className='profile-data'><span>Name: </span>{capitalize(userDetails.name.toLowerCase())}</div>
                            <div className='profile-data'><span>Email Id: </span>{userDetails.email.toLowerCase()}</div>
                        </div>
                        <div className="update">
                            <div >
                                <NavLink to="/admin/update-profile" state={{userDetails}} className="" ><button type="button" className="btn btn-outline-primary update-btn">Update Profile</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/admin/update-password" className="" ><button type="button" className="btn btn-outline-primary update-btn">Update Password</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/admin/view-complaints" className="" ><button type="button" className="btn btn-outline-primary update-btn">View Complaints</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/admin/manage-users" className="" ><button type="button" className="btn btn-outline-primary update-btn">Manage users</button></NavLink>
                            </div>

                        </div>
                    </div>
                    <div className="col-sm-7">

                    </div>
                </div>
            </div>



        </>

    )
}