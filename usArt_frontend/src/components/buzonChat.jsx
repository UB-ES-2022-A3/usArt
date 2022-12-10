import React from 'react'
import styles from '../components/buzonGeneralStyle.css'
import { BsThreeDots } from "react-icons/bs";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import AuthContext from "../context/authcontext";
import LINK_BACKEND from "./LINK_BACKEND";
import { Modal } from 'bootstrap'
import Pusher from 'pusher-js'
function BuzonChat() {
  let { user, authTokens } = useContext(AuthContext);
  const [activeUser, setActiveUser] = useState();
  const [idSala, setIdSala] = useState();
  const [meUser, setMeUser] = useState();
  const [renderList, setRenderList] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [msg, setMsg] = useState("")
  const [lastMessage, setlastMessage] = useState()
  const bottomRef = useRef(null);
  const [pusher, setPusher] = useState();
  const [channel, setChannel] = useState()

  useEffect(callApi, []);

  const [c, setC] = useState(0)


  useEffect(() => {
    if (lastMessage != null) {
      setMessageHistory([...messageHistory, JSON.parse(lastMessage)]);
      document.getElementById("lastMessage").innerHTML = JSON.parse(lastMessage).message
    }
  }, [lastMessage]);


  useEffect(() => {
    if (idSala == null) return

    setPusher(new Pusher("464bf9750a028fa769ca", { cluster: "eu", }));
  }, [idSala]);

  useEffect(() => {
    if (pusher == null) return
    setChannel(pusher.subscribe(idSala));
  }, [pusher]);

  useEffect(() => {
    if (channel == null) return
    console.log("channel creado");
    channel.bind('my-event', saveChat);
  }, [channel]);

  const saveChat = (data) => {
    if (c === 0) setlastMessage(JSON.stringify(data))
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageHistory]);


  function createchat(theuser) {

    if (document.getElementById("btnradio2").checked) {
      setMessageHistory([theuser.description])
      setActiveUser(theuser)
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
      return
    }
    setActiveUser(theuser.user);
    setIdSala(theuser.id_sala);
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

        setRenderList(data.chats)
      }
      )
  }

  function renderChats(user) {

    if (document.getElementById("btnradio1").checked) {
      return (<div className='userChat' onClick={() => createchat(user)}>
        <img src={user.user.photo} alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
        <div className="userChatInfo">
          <span className='chatsFirstName'>{user.user.user_name}</span>
          <p id="lastMessage" className='chatsMessage'>No new messages</p>
        </div>
      </div>)
    } if (document.getElementById("btnradio2").checked) {
      return (
        <div className='userChat' onClick={() => createchat(user)}>
          <img src={user.user_id.photo} alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
          <div className="userChatInfo">
            <span className='chatsFirstName'>{user.user_id.user_name}</span>
            <p className='chatsMessage'>Wants a comission from you</p>

          </div>
        </div>)
    }
  }

  function message(message) {
    if (activeUser == undefined || meUser == undefined) return
    if (document.getElementById("btnradio2").checked) {

      return (<div className="message otherside">
        <div className="messageContent">
          <img src={activeUser.user_id.photo} alt="" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }} />
          <p className='shadow-lg'>{message}</p>
        </div>
      </div>)
    }
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
      }
      )
  });
  function pendingComisions() {
    if (user == undefined) return
    fetch(
      LINK_BACKEND + "/api/catalog/user/commissions/list/", {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then(data => {
        document.getElementById("btnradio1").checked = false;
        setActiveUser()
        setMeUser()
        setRenderList(data)

      }
      )


  }
  function postComission() {

    fetch(
      LINK_BACKEND + "/api/catalog/user/commission/" + activeUser.pub_id + "&" + activeUser.user_id.id, {
      method: 'PUT',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
        'Content-Type': 'application/json',
      }, body: JSON.stringify({ "status": "AC" })
    })
      .then((res) => res.json())
      .then(data => {
        setActiveUser()
        setMeUser()
        fetch(LINK_BACKEND + "/auth/chats/" + activeUser.user_id.id, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Authorization': 'Bearer ' + authTokens.access,
          }
        })
          .then((res) => res.json())
          .then(data => {

          }
          )
        pendingComisions()
      }
      )
  }
  function deleteComission() {
    fetch(
      LINK_BACKEND + "/api/catalog/user/commission/" + activeUser.pub_id + "&" + activeUser.user_id.id, {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        pendingComisions()
        return res.json()
      })


  }
  function generalChat() {
    callApi();
  }

  function deleteChat() {
    fetch(
      LINK_BACKEND + "/api/auth/deletechat/", {
      method: 'PUT',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + authTokens.access,
        'Content-Type': 'application/json',
      }, body: JSON.stringify({ "id_sala": idSala })
    })
      .then((res) => res.json())
      .then(data => {
        setActiveUser()
        setMeUser()
        generalChat()
      }
      )
  }

  function mainChat() {
    if (activeUser != undefined) {
      return (<div className='chat'><div className="chatInfo">
        <span>{activeUser.user_name == undefined ? activeUser.user_id.user_name : activeUser.user_name}</span>
        <div onClick={() => {
          let coModal = new Modal(document.getElementById('myModal'), {
            keyboard: false
          })
          coModal.show()
        }} className="chatIcons">
          <div class="trashContainer">
            <div class="trash icons-buzon">
              <div class="tap">
                <div class="tip"></div>
                <div class="top"></div>
              </div>
              <div class="tap2">
                <div class="bottom">
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className='messages' id="scrollbar-2">
          {messageHistory.map(message)}
          <div ref={bottomRef}></div>
        </div>

        <div>
          {activeUser.user_name == undefined ?
            <div className="inputMessage " style={{ justifyContent: 'end' }}>
              <div className="send">
                <button href="#" onClick={postComission} class="accept">ACCEPT <span class="fa fa-check"></span></button>
                <button href="#" onClick={deleteComission} class="deny">DENY <span class="fa fa-close"></span></button>
              </div> </div> :
            <div className="inputMessage " >
              <div className="send">
                <input type="text" className='textInput'
                  placeholder='Type something...'
                  style={{ width: "100%", border: "none", outline: "none", fontSize: "18px", color: "black", backgroundColor: "#556b6b" }}
                  onChange={handleChange}
                  value={msg}
                  onKeyDown={(e) => enterEvent(e)} />
              </div>
              <button className='buttonSend' style={{ marginRight: "10px" }}
                onClick={handleClickSendMessage} >Send</button>
            </div>}
        </div>
      </div >)
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
              <input type="radio" onClick={generalChat} defaultChecked={true} class="btn-check " name="btnradio" id="btnradio1" autocomplete="off" />
              <label class="btn btn-light " for="btnradio1">General</label>

              <input type="radio" class="btn-check" onClick={pendingComisions} name="btnradio" id="btnradio2" autocomplete="off" />
              <label class="btn btn-light" for="btnradio2">Pending</label>
            </div>
          </div>

          <div className="chats">
            {renderList.map(renderChats)}
          </div>
        </div>
        {mainChat()}
      </div>
      <div id="myModal" class="modal fade">
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-body">
              <p>Do you really want to delete this chat? This process cannot be undone.</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" onClick={deleteChat} data-bs-dismiss="modal" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default BuzonChat
