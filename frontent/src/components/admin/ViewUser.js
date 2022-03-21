import React, { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import UserItem from './UserItem';
const host = 'http://localhost:5000';

function ViewUser() {

    const [buyers, setbuyer] = useState([]);
    const [sellers, setseller] = useState([]);
    const [agents, setagent] = useState([]);
    const [lodding, setlodding] = useState(true)

    const handleOnclick = async (id, userType) => {

        const response = await fetch(
            `http://localhost:5000/api/auth/${userType}/delete/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                },

            }
        );

        const json = await response.json();
        console.log(json)

        if (userType === 'buyer') {
            const newbuyers = buyers.filter((buyer) => { return buyer._id !== id })
            setbuyer(newbuyers)
        }
        else if (userType === 'seller') {
            const newsellers = sellers.filter((seller) => { return seller._id !== id })
            setseller(newsellers)
        }
        else {
            const newagents = agents.filter((agent) => { return agent._id !== id })
            setagent(newagents)
        }
    }

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
        <div className='row' style={{ overflowX: 'hidden' }}>
            <div className='col-md-4'>
                {lodding && <Spinner />}
                {!lodding && buyers.length == 0 ? <h2 style={{ margin: 'auto' }}>No Buyer</h2> : <div className='col-md-3 ' style={{}}><h2 style={{ margin: 'auto' }}>Buyer</h2>
                    <div className="d-flex flex-column">
                        {buyers.map((buyer, index) => {
                            return <UserItem key={buyer.id} id={buyer._id} users={buyer} index={index} userType={'buyer'} handleOnclick={handleOnclick} />
                        })}
                    </div>
                </div>}
            </div>

            <div className='col-md-4'>
                {!lodding && sellers.length == 0 ? <h2 style={{ margin: 'auto' }}>No Seller</h2> : <div className='col-md-3 ' style={{}} ><h2 style={{ margin: 'auto' }} >Seller</h2>
                    <div className="d-flex flex-column">
                        {sellers.map((seller, index) => {
                            return <UserItem key={seller.id} id={seller._id} users={seller} index={index} userType={'seller'} handleOnclick={handleOnclick} />
                        })}
                    </div>
                </div>}
            </div>

            <div className='col-md-4'>
                {!lodding && agents.length == 0 ? <h2 style={{ margin: 'auto' }}>No Agent</h2> : <div className='col-md-3' style={{}}><h2 style={{ margin: 'auto' }}>Agent</h2>
                    <div className="d-flex flex-column">
                        {agents.map((agent, index) => {
                            return <UserItem key={agent.id} id={agent._id} users={agent} index={index} userType={'agent'} handleOnclick={handleOnclick} />
                        })}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ViewUser