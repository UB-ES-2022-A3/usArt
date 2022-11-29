import React from 'react'

const SidebarChat = () => {
    return (
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

            <div className='search'>
                <div className='searchForm rounded'>
                    <input type='text' placeholder='Find a user' style={{ backgroundColor: "transparent", border: "1px", color: "white", outline: "none" }} />
                </div>
                <div className='userChat'>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span>Jane</span>
                    </div>
                </div>
            </div>

            <div className="chats">
                <div className='userChat'>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Jane</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>
                <div className='userChat '>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Roger</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>
                <div className='userChat '>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Marcus</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>
                <div className='userChat '>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Ivy</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>
                <div className='userChat'>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Ivan</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>                <div className='userChat'>
                    <img src="https://thispersondoesnotexist.com/image" alt="" style={{ height: "50px", width: "50px", objectFit: "cover", borderRadius: "50%" }} />
                    <div className="userChatInfo">
                        <span className='chatsFirstName'>Guillem</span>
                        <p className='chatsMessage'>Hello, how are you?</p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SidebarChat