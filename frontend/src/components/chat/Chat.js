import React, { useState, useEffect, useRef } from 'react'
import img from "../../img/whatsapp.png";
import { useLocation} from "react-router-dom";
import "./Chat.css"
import {io} from 'socket.io-client'
const host = "http://localhost:5000";

function Chat() {

    const location = useLocation()
    const { sender, receiver } = location.state;
    let senderId = sender.id, receiverId = receiver.id, receiverName = receiver.name, receiverType = receiver.type, senderType = sender.type, senderName = sender.name;

    const [currmessage, setcurrmessage] = useState("");
    const [arrivalMessage, setarrivalMessage] = useState(null);
    const [message, setmessage] = useState([])
    const socket = useRef()

    const onChange = (e) => {
        setcurrmessage(e.target.value)
    }

    const getMessage = async () => {
        console.log("Inside sender" , senderId)
        console.log("Inside receiver" , receiverId)
        let response = await fetch(`${host}/api/messages/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId })

        });
        const json = await response.json();
        console.log("after getting all message ", json)
        if (json.success) {
            let array = json.projectedMessages;
            let newMsg = [];

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                newMsg.push({ fromSelf: element.fromSelf, message: element.message, index: index });
            }
            setmessage(newMsg);
        }

    }

    useEffect(async () => {
        console.log({"sender is : " :sender})
        console.log("receiver is : ", receiver)
        await getMessage();
        console.log("all message : ", message)
    }, [])

    useEffect(() => {
        socket.current = io('ws://localhost:4000')
        socket.current.on("getMessage", data => {
            let newMsg = {message:data, fromSelf:false}
            setarrivalMessage(newMsg);
        })
    }, [])

    useEffect(() => {
        if(!arrivalMessage)
       {
        console.log("arrival msg change ", arrivalMessage)
        setmessage((prev) => [...prev, arrivalMessage])
       }
    }, [arrivalMessage])
    
    
    useEffect(() => {
      socket.current.emit("addUser", senderId)
      socket.current.on("getUsers", (users) => {
          console.log("this is id : ", users);
      })
    }, [sender])
    
    const checkUserConnected = async () => {

        const response = await fetch(`${host}/api/messages/getReceiver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId })

        });
        
        const json = await response.json();
        console.log({ "checkConected ": json })

        if (json.success) {

            let foundReceiver = false;

            let array_receiver = json.receivers;

            for (let index = 0; index < array_receiver.length; index++) {

                const element = array_receiver[index];
                if (senderId === element.sender) {

                    if (receiverId === element.receiver) {
                        foundReceiver = true;
                        console.log("receieve found")
                        break;
                    }

                }
                else {
                    if (receiverId === element.sender) {
                        foundReceiver = true;
                        console.log("receieve found")
                        break;
                    }
                }
            }
            return foundReceiver;
        }

    }

    const addReceiver = async () => {
        console.log("inside add receiver");

        const response = await fetch(`${host}/api/messages/addReceiver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId, receiverName: receiverName, receiverType: receiverType, senderType: senderType, senderName })

        });

        const json = await response.json();
        console.log({ "addReceiver": json });
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        let receiverCheck = await checkUserConnected();

        console.log({ "receiverChecker ": receiverCheck });
        if (!receiverCheck) {
            await addReceiver();
            console.log("after add receiver")
        }

        socket.current.emit("sendMessage", {
            senderId,
            receiverId,
            message:currmessage
        })

        const response = await fetch(`${host}/api/messages/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId, message: currmessage })
        });
        let json = await response.json();
        if (json.success) {
            let newArray = message;
            newArray.push({ fromSelf: true, message: currmessage, index: message.length });
            setmessage(newArray);
            setcurrmessage("")
        }
        else {
            return;
        }

    }
    return (
        <div className='mainDiv'> <nav>
            <img className="LOGO" src={img} alt="" />
            <h1 className='H1'>Welcome to iChart WebApp</h1>
        </nav>
            <div className="Container">
                {message.map((msg) => {
                    return (
                        <div key={msg.index} className={`message ${msg.fromSelf === true ? "left" : "right"}`}>{!msg.fromSelf ? receiverType : "you"} : {msg.message}</div>
                    )
                })}
            </div>

            <div className="send">
                <form id="send-container" onSubmit={handleSubmit}>
                    <input type="text" name="currmessage" value={currmessage} id="messageInp" onChange={onChange} defaultValue="" />
                    <button className="button">Send</button>
                </form>
            </div>

        </div>
    )
}

export default Chat