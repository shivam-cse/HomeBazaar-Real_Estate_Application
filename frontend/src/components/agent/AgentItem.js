import React from 'react'
import { Link } from "react-router-dom";

function ApartmentItem(props) {

    const { agent, sender, receiver } = props;    // destrucuturing props sent from AgentResult

    return (
        <div className="card" style={{ width: "40vw", margin: "30px auto" }}>
            <div className="card-body row">
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}> Name - </span>{agent.name}</h6>
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}>Area -</span>  {agent.workingArea}</h6>
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}>Charges -</span>  {agent.charges}</h6>
                <Link className="btn btn-primary col-md-4  my-2" to={'/chat'} state={{ sender : sender , receiver : receiver }} role="button" aria-disabled="true">Let's Chat</Link >
            </div>
        </div>
    )
}

export default ApartmentItem