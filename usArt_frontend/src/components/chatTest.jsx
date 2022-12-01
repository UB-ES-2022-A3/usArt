import React from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import "./charTest.css"
import AuthContext from "../context/authcontext";
import LINK_BACKEND from "./LINK_BACKEND";
import axios from 'axios';




export default function ChatTets() {
  const [message, setMessage] = useState("")
  let { user, authTokens } = useContext(AuthContext);
  const [socketUrl, setSocketUrl] = useState('');
  const { id } = useParams()
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(callApi, [])

  function callApi() {
    fetch(LINK_BACKEND + "/auth/chats/" + id, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
      }
    })
      .then((res) => res.json())
      .then(data => {
        console.log(data)
        setSocketUrl('ws://127.0.0.1:8000/chats/?id=' + data)

      }
      )
  }


  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }

  }, [lastMessage, setMessageHistory]);

  console.table(messageHistory)



  const handleClickSendMessage = useCallback(() => {
    let m = ' {"message":"' + message + '","user":"' + user.username + '"}';
    sendMessage(m);
  });
  
  if (user === null) {
    return <h1>Debes registrarte :/ !</h1>
  }
  const handleChange = event => {
    setMessage(event.target.value);


  };
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>

      <input type="text" onChange={handleChange} value={message}></input>

      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Send Message
      </button>
      <div>
        <span >The WebSocket is currently {connectionStatus}</span>
      </div>
      {lastMessage ? <span  >Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};


