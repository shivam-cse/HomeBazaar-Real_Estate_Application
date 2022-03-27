import React from 'react'
import "../AboutUs/aboutus.css"
import AboutUsImage from "../AboutUs/icons/contactus.png"
const AboutUs = () => {
    return (

        <div className="mybody">
            <div className="panel">
                <span className="aboutUs">About Us</span>
                <div className="pricing-plan">
                    <img src={AboutUsImage} alt="" className="pricing-img" />
                    <h3 className="pricing-header">
                        <span className="pricing-price">HomeBazaar : </span>
                        Our goal is to make online purchasing/selling/renting of properties in an easy and
                        smooth manner along with security and best user experience
                    </h3>
                    <ul className="pricing-features">
                        <li className="pricing-features-item">Email : XYZ@HomeBazaar.com</li>
                        <li className="pricing-features-item">
                            Mobile : +918851379103, +919899451287
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AboutUs