import React from 'react'
import { Link } from "react-router-dom";

function ReceiverItem(props) {

    const {  receiver , sender} = props;

    return (
        <div className="card" style={{ width: "20vw", margin: "30px auto" }}>
            <div className="card-body row">
                <h6 className="col-md-12  my-2 ">Name - {receiver.name}</h6>
                <h6 className="col-md-12  my-2 ">UserType - {receiver.type}</h6>
                <Link className="btn btn-primary col-md-12  my-2" to={'/chat'} state={{ receiver , sender }} role="button" aria-disabled="true">Let's Chat</Link >
            </div>
        </div>
    )
}

export default ReceiverItem