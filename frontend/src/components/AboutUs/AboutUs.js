import React from 'react'
import "../AboutUs/aboutus.css"
import team1img from "./img/team-1.jpeg"
import team2img from "./img/team-2.jpeg"
import team3img from "./img/team-3.jpeg"
import teamIcon from "./img/teamwork.png"

const AboutUs = () => {
    return (
        <div className='aboutus'>
            <div class="aboutuscontainer">
                <div class="section-title">
                    <h1 className='heading1'>HomeBazaar 2.0 Team!__
                        <img src={teamIcon} alt="Team Icon" className='teamIconImg' />
                    </h1>
                    <br />
                    <h2 className='heading2'> Our goal is to make online purchasing/selling/renting of properties in an easy and
                        smooth manner along with security and best user experience</h2>
                </div>

                <div class="custom-row row">
                    <div class="custom-column column">
                        <div class="team">
                            <div class="team-img">
                                <img src={team1img} alt="Team Image" className='team-img' />
                            </div>
                            <div class="team-content">
                                <h2 className='heading2'>SHIVAM SAHU</h2>
                                <h3 className='heading3'>FrontEND and BackEND DEV</h3>

                                <h4>Shivam.sahu@iiitg.ac.in</h4>
                            </div>
                            <div class="team-social">
                                <a target="_blank" href="https://www.linkedin.com/in/shivam-sahu-665389191/" class="social-li"> <i class="fab fa-linkedin-in"></i></a>
                                <a target="_blank" href="https://github.com/shivam-cse" class="social-github"> <i class="fa-brands fa-github"></i></a>
                                <a target="_blank" href="https://www.facebook.com/shivam.sahu.54584982/" class="social-fb"> <i class="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="custom-column column">
                        <div class="team">
                            <div class="team-img">
                                <img src={team2img} alt="Team Image" className='team-img' />
                            </div>
                            <div class="team-content">
                                <h2 className='heading2'>MRITUNJAY KUMAR</h2>
                                <h3 className='heading3'>FrontEND and BackEND DEV</h3>
                                <h4>Mritunjay.kumar@iiitg.ac.in</h4>
                            </div>
                            <div class="team-social">
                                <a target="_blank" href="https://www.linkedin.com/in/mritunjay-kumar-1174b8203/" class="social-li"> <i class="fab fa-linkedin-in"></i></a>
                                <a target="_blank" href="https://github.com/mritunjay7065" class="social-github"> <i class="fa-brands fa-github"></i></a>
                                <a target="_blank" href="https://www.facebook.com/Mritunjay70" class="social-fb"> <i class="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="custom-column column">
                        <div class="team">
                            <div class="team-img">
                                <img src={team3img} alt="Team Image" className='team-img' />
                            </div>
                            <div class="team-content">
                                <h2 className='heading2'>Om Prakash</h2>
                                <h3 className='heading3'>FrontEND and BackEND DEV</h3>

                                <h4>Om.Prakash@iiitg.ac.in</h4>
                            </div>
                            <div class="team-social">
                                <a target="_blank" href="https://www.linkedin.com/in/om-prakash-4705981a7/" class="social-li"> <i class="fab fa-linkedin-in"></i></a>
                                <a target="_blank" href="https://github.com/om2002" class="social-github"> <i class="fa-brands fa-github"></i></a>
                                <a target="_blank" href="https://www.facebook.com/people/Om-Prakash/100014324731492/" class="social-fb"> <i class="fab fa-facebook-f"></i></a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            {/* <Footer/> */}
        </div>
    )
}

export default AboutUs