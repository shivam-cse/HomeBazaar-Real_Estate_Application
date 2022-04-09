import React, { useState, useEffect, useRef } from 'react'
import img from "../../img/whatsapp.png";
import { useLocation } from "react-router-dom";
import chatIcon from './yellow.jpg'
import "./Chat.css"
import { io } from 'socket.io-client'
const host = "http://localhost:5000";

function Chat() {

    // used location for getting button(link) value(passing in state)
    const location = useLocation()
    const { sender, receiver } = location.state; //getting sender and receiver from button(link)
    // setting some variable
    let senderId = sender.id, receiverId = receiver.id, receiverName = receiver.name, receiverType = receiver.type, senderType = sender.type, senderName = sender.name;

    // current message in inbut box
    const [currmessage, setcurrmessage] = useState("");
    // message getting from another user(using socket)
    const [arrivalMessage, setarrivalMessage] = useState(null);
    // previous message conversation of user
    const [message, setmessage] = useState([])

    const socket = useRef()
    // ref for scrolling down(scroller) , when new message is come
    const scrollRef = useRef();

    // handle when user type on input box
    const onChange = (e) => {
        setcurrmessage(e.target.value)
    }

    //function for  getting all previous conversation of user
    const getMessage = async () => {

        // calling the api to get a previous conversation of user
        let response = await fetch(`${host}/api/messages/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId })

        });

        // getting responce of api in json
        const json = await response.json();

        // if we succesfully get a message
        if (json.success) {
            // store the conversation in array
            let array = json.projectedMessages;

            let newMsg = [];

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                newMsg.push({ fromSelf: element.fromSelf, message: element.message, index: index });
            }
            // setting the message 
            setmessage(newMsg);
        }
        else {
            alert("internal server error")
        }
    }

    // getting the previous conversation when user enter in chat page
    useEffect(async () => {
        // calling getMessage
        await getMessage();
    }, [])

    useEffect(() => {
        //socket connection 
        socket.current = io('ws://localhost:4000')
        //getting message from receiver
        socket.current.on("getMessage", data => {
            let newMsg = { message: data.message, fromSelf: false }
            setarrivalMessage(newMsg);
        })
    }, [])

    //adding message in current conversation
    useEffect(() => {
        try {
            if (arrivalMessage !== null) {
                setmessage((prev) => [...prev, arrivalMessage])
            }
        } catch (error) {
            console.log("error ", error)
        }
    }, [arrivalMessage])

    //adding users when they come  to chat page
    useEffect(() => {
        socket.current.emit("addUser", senderId)
        socket.current.on("getUsers", (users) => {

        })
    }, [sender])

    // scroll effect
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // function for checking whether sender and receiver are connected or not
    const checkUserConnected = async () => {

        // api for getting all the connection of sender
        const response = await fetch(`${host}/api/messages/getReceiver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId })

        });

        // stroing the responce in json
        const json = await response.json();

        if (json.success) {

            // variable for checking receiver is exit on sender connection or not
            let foundReceiver = false;

            // connection of sender
            let array_receiver = json.receivers;

            for (let index = 0; index < array_receiver.length; index++) {

                // single connection
                const element = array_receiver[index];

                // if current sender is sender than current receiver may be receiver
                if (senderId === element.sender) {

                    // if curent receiver is receiver then break th loop as  current receiver is connected
                    if (receiverId === element.receiver) {
                        foundReceiver = true;

                        break;
                    }

                }

                // if current sender is not sender than it is sender
                else {
                    // if curent receiver is sender then break th loop as  current receiver is connected
                    if (receiverId === element.sender) {
                        foundReceiver = true;
                        break;
                    }
                }
            }
            return foundReceiver;
        }
        else {
            alert("Internal server error")
        }

    }

    // function for connecting the receiver and sender
    const addReceiver = async () => {

        // api for connecting the receiver and sender
        const response = await fetch(`${host}/api/messages/addReceiver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId, receiverName: receiverName, receiverType: receiverType, senderType: senderType, senderName })

        });

        const json = await response.json();
    }

    // function when sender send the message
    const handleSubmit = async (e) => {

        // stop reloding of page
        e.preventDefault();

        // check if receiver and sender is connected or not
        let receiverCheck = await checkUserConnected();

        // if receiver and sender is not connected
        if (!receiverCheck) {
            // connect receiver and sender
            await addReceiver();
        }
        //sending message to receiver through socket
        socket.current.emit("sendMessage", {
            senderId,
            receiverId,
            message: currmessage
        })

        // api for adding the message in backend
        const response = await fetch(`${host}/api/messages/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: senderId, to: receiverId, message: currmessage })
        });

        let json = await response.json();
        // if we succesully add the message
        if (json.success) {
            // getting the message in newArray
            let newArray = message;
            // pushing the new  message 
            newArray.push({ fromSelf: true, message: currmessage, index: message.length });

            setmessage(newArray);
            setcurrmessage("")//empty input box
        }
        else {
            alert("Internal server error")
        }

    }
    return (
        <div className='mainDiv'> <nav>
           
            <h1 className='H1'>Welcome to HomeBazzar Chat <span>
                <img className="LOGO" src={chatIcon} alt="" />
            </span></h1>
        </nav>
            <div className="Container" >
                {message.map((msg) => {
                    return (
                        <div key={msg.index} className={`message ${msg.fromSelf === true ? "right" : "left"}`} ref={scrollRef}>{!msg.fromSelf ? receiverType : "you"} : {msg.message} </div>
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