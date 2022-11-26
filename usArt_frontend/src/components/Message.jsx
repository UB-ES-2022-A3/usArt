import React from 'react'

export const Message = () => {
  return (
    <div className="message owner">
        <div className="messageInfo">
            
            <div className="messageContent">
                <p>Hello!</p>
                <img classname="im" src="https://thiscatdoesnotexist.com/" alt="" style={{height:"40px", width:"40px", borderRadius:"50%", objectFit:"cover"}} />
            </div>
        </div>
    </div>
  )
}
