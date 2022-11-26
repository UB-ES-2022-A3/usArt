import React from 'react'

export const Message = () => {
    return (
        <div className="message owner">

            <div className="messageContent">
                <p className='shadow-lg'>Hola que tal esto es un mensaje de prueba</p>
                <img src="https://thiscatdoesnotexist.com/" alt="" style={{ height: "40px", width: "40px", borderRadius: "50%", objectFit: "cover" }} />
            </div>

        </div>
    )
}
