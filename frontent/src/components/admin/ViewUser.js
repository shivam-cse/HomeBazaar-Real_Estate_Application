import React, { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import UserItem from './UserItem';
const host = 'http://localhost:5000';

function ViewUser() {

    const [buyers, setbuyer] = useState([]);
    const [sellers, setseller] = useState([]);
    const [agents, setagent] = useState([]);
    const [lodding, setlodding] = useState(true)

    const getUser = async () => {
        let responce = await fetch(`${host}/api/auth/agent/alluser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

         let output = await responce.json();
        setagent(output);


         responce = await fetch(`${host}/api/auth/buyer/alluser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

         output = await responce.json();
        setbuyer(output);

         responce = await fetch(`${host}/api/auth/seller/alluser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        output = await responce.json();
        setseller(output);
        setlodding(false)
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <div className='row'>
            {lodding && <Spinner />}
            {!lodding && buyers.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>No Complaints</h2> : <div className='col-md-3 mx-4'><h2 style={{ margin: '20px 34vw' }}>Complaints</h2>
                <div className="d-flex flex-column">
                    {buyers.map((buyer ,index) => {
                        return <UserItem key={buyer._id} users={buyer} index={index} />
                    })}
                </div>
            </div>}
            {!lodding && sellers.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>No Complaints</h2> : <div  className='col-md-3 mx-4'><h2 style={{ margin: '20px 34vw' }}>Complaints</h2>
                <div className="d-flex flex-column">
                    {sellers.map((seller ,index) => {
                        return <UserItem key={seller._id} users={seller} index={index} />
                    })}
                </div>
            </div>}
            {!lodding && agents.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>No Complaints</h2> : <div  className='col-md-3 mx-4'><h2 style={{ margin: '20px 34vw' }}>Complaints</h2>
                <div className="d-flex flex-column">
                    {agents.map((agent ,index) => {
                        return <UserItem key={agent._id} users={agent} index={index} />
                    })}
                </div>
            </div>}
        </div>
    )
}

export default ViewUser