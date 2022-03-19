import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import ApartmentItem from './ApartmentItem';
import Spinner from '../Spinner'
const host = 'http://localhost:5000';

function ApartementResult(props) {
    // const { area } = props;

    const location = useLocation()
    const { area } = location.state
    const [apartements, setApartements] = useState([]);
    const [lodding, setlodding] = useState(true)

    const getApartment = async () => {
        const responce = await fetch(`${host}/api/apartment/getApartment/${area}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const output = await responce.json();
        setApartements(output);
        setlodding(false)
    }

    useEffect(() => {
        getApartment();
    }, [])

    return (
        <div className='container'>
            {lodding && <Spinner />}
            {!lodding && apartements.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>Currently No Property is found in {area}</h2> : <div><h2 style={{ margin: '20px 34vw' }}>Property in {area}</h2>
                <div className="d-flex flex-column">
                    {apartements.map((apartement, index) => {
                        return <ApartmentItem key={apartement._id} apartement={apartement} index={index} />
                    })}
                </div>
            </div>}
        </div>
    )
}

export default ApartementResult