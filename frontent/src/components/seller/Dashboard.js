import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'
import { NavLink } from 'react-router-dom';
export default function Dashboard() {
    const host = "http://localhost:5000";

    //useState hook to maintain the user state
    const [userDetails, setuserDetails] = useState({ name: "", email: "" })
    
    //get user details
    const getUserDetails = async (e) => {
        //API call to get user details
        const response = await fetch(`${host}/api/auth/seller/getUser`, {
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
// /Runs only on the first render page to get user data
    useEffect(() => {
        getUserDetails();
        
    }, [])

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
                                <NavLink to="/seller/update-profile" state={{userDetails}} ><button type="button" className="btn btn-outline-primary update-btn">Update Profile</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/seller/update-password" ><button type="button" className="btn btn-outline-primary update-btn">Update Password</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/seller/apartment-view" ><button type="button" className="btn btn-outline-primary update-btn">View Property</button></NavLink>
                            </div>
                            <div >
                                <NavLink to="/seller/add-apartment" ><button type="button" className="btn btn-outline-primary update-btn">Add Property</button></NavLink>
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
