import React, { useState } from 'react';
import '../css/Dashboard.css'
import { useNavigate} from 'react-router-dom';

export default function UpdateProfile() {

    //it is for handle the state of Adding apartment
    const [addApartment, setaddApartment] = useState({ address: "", area: "", bedrooms: "", size: "", price: "" });

    //state to maintain apartment type 
    const [type, setType] = useState("");

    //to navigate 
    const navigate = useNavigate();
    const host = "http://localhost:5000";

    //function to Add apartment when the user click on add button
    const handleAddApartment = async (e) => {
        //this is to do not reload our page
        e.preventDefault();

        //API call to add the apartment into our database
        const response = await fetch(`${host}/api/apartment/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ address: addApartment.address, area: addApartment.area, type: type, bedrooms: addApartment.bedrooms, size: addApartment.size, price: addApartment.price })
        });
        const json = await response.json();
        // console.log(json);
        if (json.success) {
            navigate('/seller/dashboard')
            alert("Updated")
        }
        else {
            alert("Not updated")
        }
    }

    const onChange = (e) => {
        // console.log("onchange", name);
        setaddApartment({ ...addApartment, [e.target.name]: e.target.value })
    }

    const setApartmentType = (e) => {
        setType(e.target.value)
    }

    return (
        <>
            <form onSubmit={handleAddApartment}>
                <div className='update-container'>
                    <div className='update-top bg-primary text-white'>Add Apartment </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter address</label>
                        <input type="text" className="form-control" id="name" name='address' value={addApartment.address} onChange={onChange}  required minLength={3} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter area</label>
                        <input type="text" className="form-control" id="name" name='area' value={addApartment.area} onChange={onChange}  required minLength={3} />
                    </div>
                    <select className="mb-3 form-select" aria-label="Default select example" onChange={setApartmentType} required>
                        <option value="">Select Type</option>
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                    </select>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter no of bedrooms</label>
                        <input type="number" className="form-control" id="name" name='bedrooms' value={addApartment.bedrooms} onChange={onChange}  required minLength={3} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter size</label>
                        <input type="number" className="form-control" id="name" name='size' value={addApartment.size} onChange={onChange}  required minLength={3} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Enter Price</label>
                        <input type="number" className="form-control" id="name" name='price' value={addApartment.price} onChange={onChange}  required minLength={3} />
                    </div>
                    <button type="submit" className="btn btn-success" >Add</button>
                </div>
            </form>
        </>
    )
}
