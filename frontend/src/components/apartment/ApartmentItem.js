import React from 'react'
import images from '../images'
import { Link } from "react-router-dom";
function ApartmentItem(props) {

    const { apartement, index } = props;   // destructuring apartment and index from props passed from aprtmentResult
    let no = index % 9;      // to show images between 0 to 8 

    return (
        <div className="card" style={{ width: "40vw", margin: "30px auto" }}>
            <img src={images[no]} className="card-img-top " style={{ maxHeight: '200px' }} alt="..." />
            <div className="card-body row">
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}>Price</span> - {apartement.price}</h6>
                <h6 className="col-md-4  my-2 "> <span style={{color:'purple'}}>Area</span> - {apartement.area}</h6>
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}> Size</span> - {apartement.size}</h6>
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}>No. of bedrooms</span> - {apartement.bedrooms}</h6>
                <h6 className="col-md-4  my-2 "><span style={{color:'purple'}}>Type</span>Type - {apartement.type}</h6>
                <Link className="btn btn-primary col-md-4  my-2" to={'/property'} state={{ apartement: apartement, index: no }} role="button" aria-disabled="true">View Detail</Link >
            </div>
        </div>
    )
}

export default ApartmentItem