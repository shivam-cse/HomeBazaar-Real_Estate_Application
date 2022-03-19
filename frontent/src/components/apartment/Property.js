import React from 'react'
import images from '../images'
import { Link, useLocation } from "react-router-dom";

function Property(props) {

    const location = useLocation()
    const { apartement, index } = location.state;

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

                <div className="col" id='chat'>

                </div>
            </div>
        </div >
    )
}

export default Property