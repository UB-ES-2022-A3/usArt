import React from 'react'
import styles from '../components/buzonGeneralStyle.css'
import { Component } from "react";
import { BsThreeDots, BsFillImageFill } from "react-icons/bs";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import AuthContext from "../context/authcontext";
import LINK_BACKEND from "./LINK_BACKEND";
import LINK_RESOURCES from "./LINK_RESOURCES";

function BuzonChat() {
  let { user, authTokens } = useContext(AuthContext);
  const [activeUser, setActiveUser] = useState();
  const [idSala, setIdSala] = useState();
  const [meUser, setMeUser] = useState();
  const [socketUrl, setSocketUrl] = useState('');
  const { id } = useParams()
  const [userList, setUserList] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [msg, setMsg] = useState("")
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const bottomRef = useRef(null);

  useEffect(callApi, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory([...messageHistory, JSON.parse(lastMessage.data)]);
    }
  }, [lastMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageHistory]);

  function createchat(theuser) {
    setActiveUser(theuser.user);
    setIdSala(theuser.id_sala);
    console.log(LINK_RESOURCES + '/chats/?id=' + theuser.id_sala)
    setSocketUrl(LINK_RESOURCES + '/chats/?id=' + theuser.id_sala)
    fetch(LINK_BACKEND + "/auth/chatsHistory/" + theuser.id_sala, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
      }
    })
      .then((res) => res.json())
      .then(data => {
        setMessageHistory(data.messages)
      }
      )
    fetch(LINK_BACKEND + "/api/userprofile/" + user.username, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
      }
    })
      .then((res) => res.json())
      .then(data => {
        setMeUser(data)
      }
      )
  }

  function callApi() {
    fetch(LINK_BACKEND + "/auth/activechats/", {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
      }
    })
      .then((res) => res.json())
      .then(data => {
        setUserList(data.chats)
      }
      )
  }

  function renderChats(user) {
    return (<div className='userChat' onClick={() => createchat(user)}>
      <img src={user.user.photo} alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
      <div className="userChatInfo">
        <span className='chatsFirstName'>{user.user.user_name}</span>
        <p className='chatsMessage'>Hello, how are you?</p>
      </div>
    </div>)
  }

  function message(message) {
    if (activeUser == undefined || meUser == undefined) return
    if (message.user === activeUser.user_name) {
      return (<div className="message otherside">
        <div className="messageContent">
          <img src={activeUser.photo} alt="" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <p className='shadow-lg'>{message.message}</p>
        </div>
      </div>)
    }
    else if (message.user === meUser.user_name) {
      return (<div className="message owner">
        <div className="messageContent">
          <p className='shadow-lg'>{message.message}</p>
          <img src={meUser.photo} alt="" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }} />
        </div>
      </div>)
    }
  }
  const enterEvent = (event) => {
    if (event.keyCode === 13) {
      handleClickSendMessage()
    }
  }
  const handleChange = event => {
    setMsg(event.target.value);
  };
  const handleClickSendMessage = useCallback(() => {
    if (msg === "") return
    fetch(
      LINK_BACKEND + "/auth/postchat/", {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id_sala': idSala,
        'message': msg
      })
    })
      .then((res) => res.json())
      .then(data => {
        setMsg("")
        sendMessage(JSON.stringify(data));
      }
      )
  });

  function mainChat() {
    if (activeUser != undefined) {
      return (<div className='chat'><div className="chatInfo">
        <span>{activeUser.user_name}</span>
        <div className="chatIcons">
          <BsThreeDots style={{ cursor: "pointer" }} />
        </div>
      </div>
        <div className='messages' id="scrollbar-2">
          {messageHistory.map(message)}
          <div ref={bottomRef}></div>
        </div>

        <div className="inputMessage ">
          <input type="text" className='textInput'
            placeholder='Type something...'
            style={{ width: "100%", border: "none", outline: "none", fontSize: "18px", color: "black", backgroundColor: "#556b6b" }}
            onChange={handleChange}
            value={msg}
            onKeyDown={(e) => enterEvent(e)} />
          <div className="send">
            <button className='buttonSend  ' style={{ marginRight: "10px" }} onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>Send</button>
          </div>
        </div>
      </div>)
    }
    return (<div className='chat'>
    </div>)
  }


  return (
    <div className='center-chat'>
      <div className='containerC'>
        <div className='sidebar border-right-0'>
          <div className='navbar '>
            <h2 className='ml-4 logo'> Inbox</h2>
          </div>

          <div className='selectGoP flex text-center pt-1 pb-4'>
            <div class="btn-group " role="group" aria-label="Basic radio toggle button group btn-dark">
              <input type="radio" class="btn-check " name="btnradio" id="btnradio1" autocomplete="off" />
              <label class="btn btn-light " for="btnradio1">General</label>

              <input type="radio" class="btn-check  " name="btnradio" id="btnradio2" autocomplete="off" />
              <label class="btn btn-light" for="btnradio2">Pending</label>
            </div>
          </div>

          <div className="chats">
            {userList.map(renderChats)}
          </div>
        </div>


        {mainChat()}

      </div>
    </div>

  )
}

export default BuzonChat
