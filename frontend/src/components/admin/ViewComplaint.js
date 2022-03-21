import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import ComplaintItem from './ComplaintItem';
import Spinner from '../Spinner'
const host = 'http://localhost:5000';

function ViewComplaint() {

    const [complaints, setcomplaints] = useState([]);
    const [lodding, setlodding] = useState(true)

    const getComplaint = async () => {
        const responce = await fetch(`${host}/api/complaint/fetchAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });

        const output = await responce.json();
        setcomplaints(output.complaints);
        setlodding(false)
    }

    useEffect(() => {
        getComplaint();
    }, [])

    return (
        <div className='container'>
            {lodding && <Spinner />}
            {!lodding && complaints.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>No Complaints</h2> : <div><h2 style={{ margin: '20px 34vw' }}>Complaints</h2>
                <div className="d-flex flex-column">
                    {complaints.map((complaint ,index) => {
                        return <ComplaintItem key={complaint._id} complaint={complaint} index={index} />
                    })}
                </div>
            </div>}
        </div>
    )
}

export default ViewComplaint