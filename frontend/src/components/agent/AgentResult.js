import React, { useEffect, useState } from 'react'
import { Link, useLocation , useNavigate } from "react-router-dom";
import AgentItem from './AgentItem';
import Spinner from '../Spinner'

const host = 'http://localhost:5000';

function AgentResult() {
    // const { area } = props;

    const location = useLocation()
    const { area } = location.state
    const navigate = useNavigate();
    let areaNEW = area.toLowerCase();
    const [agents, setAgent] = useState([]);
    const [loading, setloading] = useState(true)
    const [sender, setsender] = useState({type:"", name:"", id:""})

    const userDetails  = async () =>{
        let type = localStorage.getItem('userType')
         let  response = await fetch(`${host}/api/auth/${type}/getUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },

        });
        //getting user data
        let json = await response.json();
        console.log("sender : ", json)
        if (json.success) {
            //when we get the user data successfully, set that
            setsender({type:type, name: json.user.name,id:json.user._id })
        }

        console.log(loading)
        setloading(false);
        console.log(loading)
    }


    const getAgent= async () => {
        const responce = await fetch(`${host}/api/auth/agent/getAgent/${areaNEW}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const output = await responce.json();
        console.log("output ",output)
        setAgent(output.agents);
        setloading(false)
    }

    useEffect(async () => {
        if(!localStorage.getItem('token'))
          navigate("/login");
        else{
            await userDetails();
            await getAgent();
        }
        
    }, [])

    return (
        <div className='container'>
            {loading && <Spinner />}
            {!loading && agents.length == 0 ? <h2 style={{ marginTop: '20px', marginLeft: '10vw' }}>Currently No Property is found in {area}</h2> : <div><h2 style={{ margin: '20px 34vw' }}>Property in {area}</h2>
                <div className="d-flex flex-column">
                    {agents.map((agent) => {
                        let receiver = {id : agent._id , name : agent.name ,type :"agent" }
                        return <AgentItem key={agent._id} agent ={agent} sender={sender} receiver={receiver}/>
                    })}
                </div>
            </div>}
        </div>
    )
}

export default AgentResult