import React, { useEffect, useState } from 'react'
import images from '../images'
import { useLocation, useNavigate, NavLink } from "react-router-dom";
const host = "http://localhost:5000";
function Property(props) {

    const navigate = useNavigate();    // for page redirection/navigation

    useEffect(() => {
        if (!localStorage.getItem('token'))          // only logged in user can see access this page therefore we are verifying here
        {
            navigate("/");
        }
    }, [])

    const location = useLocation()         // Getting location of  page
    const { apartement, index } = location.state;    // getting details out of location state
    const [receiver, setreceiver] = useState({ type: "", name: "", id: "" })   // useState for receiver
    const [sender, setsender] = useState({ type: "", name: "", id: "" })       // useState for sender 
    const [loading, setloading] = useState(true)                         // useState for loading 

    //API Call to get details(name,type and id) of user visiting this page 
    const userDetails = async () => {
        let type = localStorage.getItem('userType')
        let response = await fetch(`${host}/api/auth/${type}/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },

        });
        //getting user data
        let json = await response.json();

        if (json.success) {
            //when we get the user data successfully, set that
            setsender({ type: type, name: json.user.name, id: json.user._id })
        }

        // API Call for getting sender details(name,type and id)) whose apartment is shown in this page
        response = await fetch(`${host}/api/auth/seller/getseller/${apartement.seller}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },

        });
        //getting user data
        json = await response.json();

        if (json.success) {
            //when we get the user data successfully, set that
            setreceiver({ type: "seller", name: json.user.name, id: apartement.seller })
        }
        setloading(false);

    }

    useEffect(() => {
        userDetails()   // calling userDetails() function
    }, [])


    return (
        <div style={{ backgroundColor: 'whitesmoke', width: '100%', overflow: 'hidden' }} >
            <div id="img" style={{ width: '70vh', marginTop: '20px', height: '70vh', marginLeft: '15vw' }}>
                <img src={images[index]} style={{ maxHeight: '70vh' }} />
            </div>
            <div className="row" style={{ marginTop: '50px', marginBottom: '20px', backgroundColor: 'whitesmoke' }} id="detail">
                <div className="col" id="overview" style={{ marginLeft: '15vw' }}>
                    <div className="card" style={{ width: '30vw', backgroundColor: 'whitesmoke' }}>
                        <div className="card-body">
                            <h3 className="card-title">Price - {apartement.price}</h3>
                            <h3 className="card-title">Area - {apartement.area}</h3>
                            <h3 className="card-title">Size - {apartement.size}</h3>
                            <h3 className="card-title">Number of bedrooms - {apartement.bedrooms}</h3>
                            <h3 className="card-title">Type - {apartement.type}</h3>
                            <h3 className="card-title">Address - {apartement.address}</h3>
                        </div>
                    </div>
                </div>

                {!loading ? <div className="col" id='chat'>
                    <NavLink to="/chat" state={{ sender, receiver }}   ><button type="button" className="btn btn-primary  btn-circle" style={{ borderRadius: "400px", marginTop: '50px' }} >Chat Seller</button></NavLink>
                </div> : <div></div>}
            </div>
        </div >
    )
}

export default Property