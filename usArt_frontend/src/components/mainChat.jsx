import React from 'react'
import { BsThreeDots, BsFillImageFill } from "react-icons/bs";
import { Messages } from './Messages';

const mainChat = () => {
    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>Jane</span>
                <div className="chatIcons">
                    <BsThreeDots style={{cursor: "pointer"}}/>
                </div>      
            </div>
            <Messages className="messages"/>

            <div className="inputMessage ">  
                <input type="text" className='textInput'  placeholder='Type something...' style={{width:"100%", border:"none", outline:"none", fontSize:"18px", color:"black", backgroundColor:"#556b6b"}}/>
                <div className="send">
                    <BsFillImageFill className="" size={35} style={{color:"black", marginRight:"10px"}}/>
                    <button className='buttonSend  'style={{ marginRight:"10px"}}>Send</button>
                </div>
            </div>

        </div>
    )
}

export default mainChat