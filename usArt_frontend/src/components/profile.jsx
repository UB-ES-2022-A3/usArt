import React, { useState } from 'react';
import { useEffect, useContext } from 'react';
import './profile.css';
import { useParams } from "react-router-dom";
import LINK_BACKEND from "./LINK_BACKEND"
import Footer from './footer'
import AuthContext from "../context/authcontext";

function Profile() {

    const { username } = useParams();
    const [prof, setProfile] = useState([])
    const [stars, setStars] = useState(0)
    const [message, setMessage] = useState('');
    const { user, authTokens } = useContext(AuthContext);

    useEffect(callApi, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/userprofile/" + username)
            .then((res) => res.json())
            .then(data => {
                setProfile(data);
            }
            )

    }
    const handleMessageChange = event => {
        // 👇️ access textarea value
        setMessage(event.target.value);
    };

    function sendReview() {
        fetch(
            LINK_BACKEND + "/api/userprofile/review-artist/", {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'reviewed_id': prof.id, 
                'stars': stars,
                'review':message
            })
        })
        document.getElementById("profileOpacity").style.opacity = "1"
    }
    function is_self() {
        if (username === user.username) {
            return
        }
        return <button type="button" data-bs-toggle="modal" onClick={() => document.getElementById("profileOpacity").style.opacity = "0.5"} data-bs-target="#staticBackdrop" class="btn btn-dark">Rate me!</button>

    }
    return (
        <div >
            <div id='profileOpacity'>
                <section className="h-100 gradient-custom-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="card" style={{ width: "70vw" }}>
                        <div className=" rounded-top text-white d-flex flex-row" style={{ height: "200px", backgroundColor: "#000" }} >
                            <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                                <img src={prof.photo}
                                    alt="Profile" className="img-fluid img-thumbnail mt-4 mb-2"
                                    style={{ width: "150px", zIndex: "1" }} />
                            </div>
                            <div className="ms-3" style={{ marginTop: "130px" }}>
                                <h5>{prof.user_name}</h5>
                            </div>
                        </div>
                        <div className="p-4 text-black" style={{ backgroundColor: "#f5f5f5" }}>
                            <div style={{ marginTop: "1%", marginLeft: "5px", justifyContent: "right", display: "flex" }}  >
                                {is_self()}
                                <div className="ratings">
                                    <div className="empty-stars"></div>
                                    <div className="full-stars" ></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 text-black">
                            <div className="mb-5">
                                <p className="lead fw-normal mb-1">About</p>
                                <div className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5" }}>
                                    <p className="font-italic mb-1">{prof.description}</p>

                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center " >
                            <div className="col-lg-8">
                                <div className="card-body  p-4 text-black text-center ">
                                    <div className="mb-5 rounded-top " style={{ backgroundColor: "#f5f5f5" }}>
                                        <div className="btn-group px-4 py-3 ">
                                            <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" />
                                            <label className="btn btn-dark" htmlFor="radio1">My products</label>
                                            <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" />
                                            <label className="btn btn-dark" htmlFor="radio2">My services</label>
                                            <input type="radio" className="btn-check" name="options" id="radio3" autoComplete="off" />
                                            <label className="btn btn-dark" htmlFor="radio3">Purchase History</label>
                                        </div>
                                        <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content custom-modal">
                        <div className="modal-header custom-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Have a nice words to {username} :)</h5>
                            <div class="star-rating">
                                <input type="radio" name="stars" id="star-a" value="5" />
                                <label for="star-a" onClick={() => setStars(5)}></label>

                                <input type="radio" name="stars" id="star-b" value="4" />
                                <label for="star-b" onClick={() => setStars(4)}></label>

                                <input type="radio" name="stars" id="star-c" value="3" />
                                <label for="star-c" onClick={() => setStars(3)}></label>

                                <input type="radio" name="stars" id="star-d" value="2" />
                                <label for="star-d" onClick={() => setStars(2)}></label>

                                <input type="radio" name="stars" id="star-e" value="1" />
                                <label for="star-e" onClick={() => setStars(1)}></label>
                            </div>

                            <button style={{ backgroundColor: "white" }} type="button" onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body custom-body-modal ">
                            <div class="search-container">
                                <textarea maxLength="300" type="text" onChange={handleMessageChange} placeholder="try: you are awesome with the brush" />
                            </div>
                        </div>
                        <div className='modal-footer custom-footer'>
                            <button id="search-btn" onClick={sendReview} data-bs-dismiss="modal" aria-label="Close" className='btn2'>Rate</button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>

    );
}

export default Profile;