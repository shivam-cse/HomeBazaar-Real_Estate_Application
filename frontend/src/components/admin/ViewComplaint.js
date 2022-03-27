import React, { useEffect, useState } from 'react'
import ComplaintItem from './ComplaintItem';
import Spinner from '../Spinner'
const host = 'http://localhost:5000';

function ViewComplaint() {

    const [complaints, setcomplaints] = useState([]);   // state for storing complaints
    const [lodding, setlodding] = useState(true)       // checking content loading


    //API call to see all complaints
    const getComplaint = async () => {
        const responce = await fetch(`${host}/api/complaint/fetchAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });

        const output = await responce.json();
        setcomplaints(output.complaints);     // updating state of complaints  
        setlodding(false)                    // updating state of setLodding
    }

    useEffect(() => {
        getComplaint();   // calling getComplaint() function
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