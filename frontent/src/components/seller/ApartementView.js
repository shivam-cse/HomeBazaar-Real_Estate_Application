import React, { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import ApartmentItem from './ApartmentItem';
const host = 'http://localhost:5000';

function ApartementView(props) {
   
    const [apartements, setApartements] = useState([]);
    const [lodding, setlodding] = useState(true)
    //get all apartment of loggined user(seller)
    const getApartment = async () => {
        const responce = await fetch(`${host}/api/apartment/fetchSellerApartment`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':localStorage.getItem('token')
            },
        });

        const output = await responce.json();
        setApartements(output);
        setlodding(false)
    }

     //delete apartment by taking the id of apartment which seller want to delete
     const deleteApartment = async (id) => {
        
        //API call to delete aprtment
        const response = await fetch(`${host}/api/apartment/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });

        // const json = response.json()
        const newAprtments = apartements.filter((apartement) => { return apartement._id !== id })
        setApartements(newAprtments)
    }

// /Runs only on the first render page to get all apartment
    useEffect(() => {
        getApartment();
    }, [])
    return (
        <div className='container'>
            {lodding && <Spinner />}
            {!lodding && apartements.length === 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>Currently No Property is listed</h2> : <div><div className='dashboard-top  bg-primary text-white'>Your Listed Apartment </div>
                <div className="d-flex flex-column">
                    {apartements.map((apartement, index) => {
                        return <ApartmentItem key={apartement._id} apartement={apartement} index={index} deleteApartment={deleteApartment} />
                    })}
                </div>
            </div>}
        </div>
    )
}

export default ApartementView