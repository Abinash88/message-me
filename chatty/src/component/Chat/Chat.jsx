import React, { useContext, useEffect, useState } from 'react'
import SocketIo from 'socket.io-client'
import './Chat.css'
import { toast } from 'react-hot-toast';
import Message from '../Message/Message';
import ReactScrollToBottom from 'react-scroll-to-bottom';
import { format } from 'date-fns'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import {useHistory, useNavigate}  from 'react-router-dom';


const ENDPOINT = 'http://localhost:5000'

let socket;

const Chat = () => {

    const navigate = useNavigate();

    const [id, setid] = useState('');
    const [messages, setMessages] = useState([])
    const currDate = new Date();
    const FormatDate = format(currDate, 'dd MMM yyyy HH:mm:ss');
    const [GroupMessages, setGroupMessages] = useState([]);
    const [userData, setUserData] = useState();

    const GetFacebookUser = async () => {
        try {
            const res = await fetch('http://localhost:5000/Login/Success', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (!data.success) return navigate('/');
            return data
        } catch (err) {
            console.log(err.message);
        }
    }
   
    

    const SendMessageBackend = async() => {
        const message = document.getElementById('chatInput').value
        if (message === '') return toast.error('Message is Empty!');
        socket.emit('message', { message, FormatDate, userId: userData.user._id });
        try{    
            const res = await axios.post('http://localhost:5000/PostMessage',{
                message,
                date:FormatDate,
                UserId:userData.user._id,
                userName:userData.user.name
            }, {withCredentials:true})

            const main = res.data;
            if(!main.success) console.log(main.message);
            document.getElementById('chatInput').value = ''
        }catch(err) {
            console.log(err.message);
        }
    } 

    const DeleteMessage = async() => {
        try{
            const res = await axios.put('http://localhost:5000/DeleteMessage');
            const main = res.data;
            if(!main.success) return console.log(main.message);
            toast.success(main.message);
        }catch(err) {
            console.log(err.message);
        }
    }


    useEffect(() => {
        axios.get('http://localhost:5000/GetallMessages').then((data) => data.data).then((message) => {
            setGroupMessages(message.messages)
        })
    },[DeleteMessage, SendMessageBackend])


 


    useEffect(() => {
        socket = SocketIo(ENDPOINT, { transports: ['websocket'] });
        socket.on('connection', () => {
            setid(socket.id);
        })

        GetFacebookUser().then((data) => {
            setUserData(data);
            if (data && data.id) {
                socket.emit('joined', { user: data.name });
            }
        })


        socket.on('welcome', ({ user, message }) => {
            toast.success(message);
        })
        socket.on('userJoined', (data) => {
            toast.success(data.message)
        })


        socket.on('leave', (data) => {
            console.log(data.message)
            toast.success(data.message);
        })

        return () => {
            socket.emit('disconnected');
            socket.off();
        }

    }, [])


    useEffect(() => {

        socket.on('sendmessage', (data) => {
            setGroupMessages((item) => [...item, data ])
            toast.success(data.user, data.message);
        })

       

        return () => {
            socket.off();
        }
    }, [])


    useEffect(() => {
        socket.on('GetMessages', (data) => {
            setMessages((d) => [...d, data]);
            toast.success(data.user, data.message);
        })

        return () => {
            socket.off();
        }
    },[])


    const DeleteEachMessage = async(id) => {
        try{
            const res = await fetch(`http://localhost:5000/DeleteEachItem`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    messageId:id
                }
            });
            const data = await res.json();
            if(!data.success) console.log(data.message);
            toast.success(data.message);
        }catch(err) {
            console.log(err.message);
        };
    }

    const Logout = async() => {
        try{
            const res = await axios.get(`http://localhost:5000/Signout`);
            const data =  res.data;
            if(!data.success) console.log(data.message);
            toast.success(data.message);
            navigate('/')
        }catch(err) {
            console.log(err.message);
        };
    }

    return (
        <div className='Chatpage'>
            <div className="chatCont">

                <div className="chatHeader">
                    {userData?.user?.name}
                </div>
                <ReactScrollToBottom className="messageBox">
                    <div className="chatbox">
                        {
                            GroupMessages?.map((item, index) => {
                                return (
                                    <Message DeleteEachMessage={DeleteEachMessage} DateTime={item.userName === userData?.user.name ? 'firstDate' : 'secDate'} key={index} classs={item.userName === userData?.user?.name ? 'message' : 'frnMessage'} item={item} />
                                )
                            })
                        }

                    </div>

                </ReactScrollToBottom>

                <div className="inputbox">
                    <input type="text" placeholder='input message here...' id='chatInput' />
                    <button onClick={SendMessageBackend} className='sendbtn' > <PaperAirplaneIcon className='' style={{ height: '35px' }} /> </button>
                </div>
                <div className="clearbtn">
                    <button onClick={DeleteMessage}>Clear Message</button>
                    <button onClick={Logout}>Logout</button>

                </div>
            </div>
        </div>
    )
}

export default Chat