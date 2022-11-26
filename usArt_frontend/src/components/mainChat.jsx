import React from 'react'
import { BsThreeDots } from "react-icons/bs";
import { Messages } from './Messages';

const mainChat = () => {
    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>Jane</span>
                <div className="chatIcons">
                    <BsThreeDots/>
                </div>      
            </div>
            <Messages/>
        </div>
    )
}

export default mainChat