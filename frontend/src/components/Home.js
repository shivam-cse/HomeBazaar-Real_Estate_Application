import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './css/Home.css';
import buyImg from '../img/buy.jpg'
import rent from '../img/rent.jpg'
import ALert from './Alert';

// Home Page of application
function Home() {

    // using useState for using area value
    const [area, setArea] = useState("")

    // setting type of searching(agent , property)
    const [type, settype] = useState("")

    // handle for change of city value
    const onChange = (e) => {
        setArea(e.target.value);
    }

    // handle for change of type(agent , property) value
    const setSearchingType = (e) => {
        console.log("e.target.value is ", e.target.value)
        console.log("type is now set as : ", type)
        settype(e.target.value)
    }

    return (
        <div id="cont">
            <ALert />
            <form className="d-flex responsive-home" id='searchSection'>
                {/* <select className="mb-2 form-select" aria-label="Default select example" onChange={setSearchingType} style={{ width: "100px" }} required>
                    <option value="">Select</option>
                    <option value="property">Property</option>
                    <option value="agent">Agent</option>
                </select> */}
                <div style={{ width: "100px" }} >
                    <div class="form-check" onClick={setSearchingType} >
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="agent" />
                        <label class="form-check-label" for="flexRadioDefault1">
                            <b> Agent</b>
                        </label>
                    </div>
                    <div class="form-check" onClick={setSearchingType} >
                        <input class="form-check-input " type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="property" />
                        <label class="form-check-label" for="flexRadioDefault2" >
                            <b> Property </b>
                        </label>
                    </div>
                </div>
                <input className="form-control  mt-10 rounded-pill" type="text" pattern="[a-zA-Z]*" placeholder="Enter Area/Agent For Property" id="area" name='area' onChange={onChange} value={area} aria-label="Search" required />
                <Link className={`btn btn-primary mx-1 border-search ${type === "" ? "disabled" : ""}`} to={type === "property" ? '/apartmentResult' : '/agentResult'} state={{ area: area }} role="button" aria-disabled="true">Search</Link >
            </form>
            <div className='container'>
                <div className="d-flex justify-content-between responsive-cards">
                    <div className="card custom-card" style={{ width: "18rem", borderRadius: "0.65rem", backgroundColor: 'whitesmoke' }}>
                        <img src={buyImg} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Buying a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Explore Property at your fingertips</p>
                    </div>

                    <div className="card custom-card" style={{ width: "18rem", borderRadius: "0.65rem", backgroundColor: 'whitesmoke' }}>
                        <img src={rent} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Renting a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Benefits that fit right be it any site</p>
                    </div>

                    <div className="card custom-card" style={{ width: "18rem", borderRadius: "0.65rem", backgroundColor: 'whitesmoke' }}>
                        <img src={buyImg} id="sloganCardImg" />
                        <h6 className="card-title" style={{ margin: '2px auto', color: 'rgb(65, 65, 199)' }}>Sell/Rent a Property</h6>
                        <p className="card-text" style={{ margin: '20px auto', color: 'rgba(53, 51, 51, 0.712)' }}>Explore the exceptional services</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home