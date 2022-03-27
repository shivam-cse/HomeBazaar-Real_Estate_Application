import React from 'react'
import images from '../images'

function ApartmentItem(props) {
 // Destructuring apartment   from props
    const { apartement, index, deleteApartment } = props;
    let no = index % 9;

    return (
        <div className="card" style={{ width: "50vw", margin: "30px auto" }}>
            <img src={images[no]} className="card-img-top " style={{ maxHeight: '200px' }} alt="..." />
            <div className="card-body row">
                <h6 className="col-md-4  my-2 ">Price - &#8377; {apartement.price}</h6>
                <h6 className="col-md-4  my-2 ">Area - {apartement.area}</h6>
                <h6 className="col-md-4  my-2 ">Size - {apartement.size}</h6>
                <h6 className="col-md-4  my-2 ">No. of bedrooms - {apartement.bedrooms}</h6>
                <h6 className="col-md-4  my-2 ">Type - {apartement.type}</h6>
                <h6 className="col-md-4  my-2 ">Availability - {apartement.availability}</h6>
                <button className="btn btn-primary col-md-4 mx-2 my-2" onClick={() => deleteApartment(apartement._id)}>Delete</button>
                <button className="btn btn-primary col-md-4 mx-2 my-2">Update</button>
            </div>
        </div>
    )
}

export default ApartmentItem