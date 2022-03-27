import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'
import { NavLink } from 'react-router-dom';
import Alert from '../Alert'
import Receiver from '../chat/Receiver';

export default function Dashboard() {
    const host = "http://localhost:5000";

    //useState hook to maintain the user state
    const [userDetails, setuserDetails] = useState({ name: "", email: "", id: "" })
    //state for loading
    const [loading, setloading] = useState(true)
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
            setuserDetails({ name: json.user.name, email: json.user.email, id: json.user._id })
        }
        else {
            alert("Your credentails is not valid. please try to login again!")
        }
        setloading(false);

    }
    // /Runs only on the first render page to get user data
    useEffect(async () => {
        await getUserDetails();

    }, [])

    function capitalize(name) {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
    }

    return (
        <div style={{overflowY:"hidden", height:"100vh"}}>
            {!loading ?<div><Alert />
            <div className='dashboard-top bg-primary text-white'>Dashboard </div>
            <div className='dashboard'>
                <div className="row">
                    <div className="col-sm-5">
                        <div className='profile'>
                            <div className='profile-data'><span>Name: </span>{capitalize(userDetails.name.toLowerCase())}</div>
                            <div className='profile-data'><span>Email Id: </span>{userDetails.email.toLowerCase()}</div>
                        </div>
                        <div className="update">
                            <div >
                                <NavLink to="/seller/update-profile" state={{ userDetails }} ><button type="button" className="btn btn-outline-primary update-btn">Update Profile</button></NavLink>
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
                        <h2 style={{margin : "auto"}}>Your chat history</h2>
                       <div className='chat-section' >
                       <Receiver id={userDetails.id} />
                       </div>
                    </div>
                </div>
            </div></div>:<div></div>}



        </div>

    )
}
