import React, { useEffect, useState } from 'react'
import '../css/Dashboard.css'
import Alert from '../Alert'
import { NavLink } from 'react-router-dom';
import Receiver from '../chat/Receiver';

export default function Dashboard() {
    const host = "http://localhost:5000";      //HOST 

    //useState hook to maintain the user state
    const [userDetails, setuserDetails] = useState({ name: "", email: "", id: "" })

    const [loading, setloading] = useState(true)    // useState hook for loading state

    // /This is function to fetch user details
    const getUserDetails = async (e) => {

        //API call to fetch user data
        const response = await fetch(`${host}/api/auth/buyer/getUser`, {
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
        setloading(false);   // setting setState of loading to false

    }
    // /Runs only on the first render page to get user data
    useEffect(() => {
        getUserDetails();   // calling getUserDetails() function 

    }, [])

    function capitalize(name)    // function to capitalize name of buyer
    {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
    }
    return (
        <>
            {!loading ? <div>
                <Alert />
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
                                    <NavLink to="/buyer/update-profile" state={{ userDetails }} className="" ><button type="button" className="btn btn-outline-primary update-btn">Update Profile</button></NavLink>
                                </div>
                                <div >
                                    <NavLink to="/buyer/update-password" className="" ><button type="button" className="btn btn-outline-primary update-btn">Update Password</button></NavLink>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-7">
                            <h2 style={{ margin: "auto" }}>Your chat history</h2>
                            <div className='chat-section' >
                                <Receiver id={userDetails.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div></div>}
        </>

    )
}
