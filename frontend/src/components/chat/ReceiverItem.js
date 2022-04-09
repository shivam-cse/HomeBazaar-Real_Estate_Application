import React from 'react'
import { Link } from "react-router-dom";

function ReceiverItem(props) {

    const { receiver, sender } = props;

    return (
        <div className="card sc4" style={{ width: "20vw", margin: "30px auto" }}>
            <div className="backgroundChat card-body row " style={{fontWeight:"bold"}}>
                <h6 className="col-md-12  my-2 "><span > Name -</span> <span style={{color:"#c3efb8"}}>{receiver.name}</span></h6>
                <h6 className="col-md-12  my-2 "><span>User Type - </span> <span style={{color:"#c3efb8"}}>{receiver.type} </span> </h6>
                <Link className="btn btn-primary col-md-12  my-2 lets-chat-btn" to={'/chat'} state={{ receiver, sender }} role="button" aria-disabled="true">Let's Chat</Link >
            </div>

        </div>
    )
}

export default ReceiverItem