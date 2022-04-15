import React from 'react'
import './css/Footer.css'
import { Link } from "react-router-dom";
function Footer() {
    return (
        <footer class="footer">
            
            <div class="Footercontainer">
                <div class="Footerrow">
                    <div class="footer-col">
                        <h4>company</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">about us</Link></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Contact Us</h4>
                        <ul>
                            <li><p>9026878655</p></li>
                            <li><p>7065885853</p></li>
                            <li><p>7061706284</p></li>
                            <li><p>HomeBazzar@gmail.com</p></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>follow us</h4>
                        <div class="social-links">
                            <Link to="#"><i class="fab fa-facebook-f"></i></Link>
                            <Link to="#"><i class="fab fa-twitter"></i></Link>
                            <Link to="#"><i class="fab fa-instagram"></i></Link>
                            <Link to="#"><i class="fab fa-linkedin-in"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer