import React,{ useState , useEffect } from "react";
import queryString from "query-string";      //Parse and stringify URL query strings
import io from 'socket.io-client';           //socket.io for client-side usage
import "./Chat.css";
import InfoBar from '../InfoBar/InfoBar';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';


let socket;
const Chat = ({location}) => { 
    // Following useState hooks as same in 'Join.js' :
    let [name ,setName] = useState('');  
    let [room ,setRoom] = useState('');
    let [message ,setMessage] = useState('');            //message = current message 
    let [messages ,setMessages] = useState([]);        //messages = array with all messages 
    const [users, setUsers] = useState('');
    const ENDPOINT = 'localhost:5000';
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
    
        socket = io(ENDPOINT);
    
        setRoom(room);
        setName(name)
    
        socket.emit('join', { name, room }, (error) => {
          if(error) {
            alert(error);
          }
        });
      }, [ENDPOINT, location.search]);
      
      useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
    }, []);
    
      const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
      }
    
      return (
        <div className="outerContainer">
          <div className="container">
              <InfoBar room={room} />
              <Messages messages={messages} name={name} />
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
          <TextContainer users={users}/>
        </div>
      );
    }
    
    export default Chat;
