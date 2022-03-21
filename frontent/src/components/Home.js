import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './css/Home.css';
import buyImg from '../img/buy.jpg'
import rent from '../img/rent.jpg'




function Home() {

    // using useState for using area value
    const [area, setArea] = useState("")

    // handle for change of city value
    const onChange = (e) => {
        setArea(e.target.value);
    }

    return (
        <div id="cont">
            <form className="d-flex" id='searchSection'>
                <input className="form-control  mt-10 mx-4" type="search" placeholder="Enter Area For Property" id="area" name='area' onChange={onChange} value={area} aria-label="Search" />
                <Link className="btn btn-primary mx-1" to={'/apartmentResult'} state={{ area: area }} role="button" aria-disabled="true">Login</Link >
            </form>
            <div className='container'>
                <div className="d-flex justify-content-between">
                    <div className="card" style={{ width: "18rem", backgroundColor: 'whitesmoke' }}>
                        <img src={buyImg} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Buying a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Explore Property at your fingertips</p>
                    </div>

                    <div className="card" style={{ width: "18rem", backgroundColor: 'whitesmoke' }}>
                        <img src={rent} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Renting a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Benefits that fit right be it any site</p>
                    </div>

                    <div className="card" style={{ width: "18rem", backgroundColor: 'whitesmoke' }}>
                        <img src={buyImg} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Sell/Rent a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Explore the exceptional services</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home