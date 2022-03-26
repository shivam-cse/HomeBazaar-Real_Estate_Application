import React, { useEffect, useState } from 'react'
import ReceiverItem from './ReceiverItem';
const host = "http://localhost:5000";

export default function Receiver(props) {
    // const {id} = props;
    // let id = "6237279db6d0bcaa2a505edc"
   
    const {id} = props
    
    const [receiver, setreceiver] = useState([])
    const [loading, setloading] = useState(true)
    const [sender, setsender] = useState({})

    const getReceiver = async () => {
        const response = await fetch(`${host}/api/messages/getReceiver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: id })

        });
        const json = await response.json();
        console.log(json)

        if (json.success) {
            let array_receiver = json.receivers;
            let new_receiver = []

            let newSender ={};
            for (let index = 0; index < array_receiver.length; index++) {
                const element = array_receiver[index];
               
                if (id === element.sender) {
                    new_receiver.push({ id: element.receiver, name: element.receiverName, type: element.receiverType })
                    newSender = { id: element.sender, name: element.senderName, type: element.senderType };
                }
                else {
                    new_receiver.push({ id: element.sender, name: element.senderName, type: element.senderType })
                    newSender = { id: element.receiver, name: element.receiverName, type: element.receiverType };
                }

            }
            setsender(newSender)
            setreceiver(new_receiver);
            console.log("ijeru ", new_receiver)
        }
        setloading(false)
    }

    useEffect(async () => {
        await getReceiver();
        console.log("inside ", sender)
        console.log("inse3", receiver)
        console.log("props33 = ", id)
    }, [])

    return (
        <div>
            {!loading ? <div>{receiver.map((rec) => {
                return <ReceiverItem key={rec._id} receiver={rec} sender={sender} />
            })}</div> : <div></div>}
        </div>
    )
}
