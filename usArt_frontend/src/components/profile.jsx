import React, { useState } from 'react';
import { useEffect } from 'react';
import './profile.css';
import { useParams } from "react-router-dom";
import LINK_BACKEND from "./LINK_BACKEND"
import Footer from './footer'


function Profile() {

    const { username } = useParams();
    let is_self = false;
    const [prof, setProfile] = useState([])

    useEffect(callApi, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/userprofile/" + username)
            .then((res) => res.json())
            .then(data => {
                console.log(data)
                is_self = data.is_self;
                setProfile(data);
            }
            )

    }


    return (
        <div>
            <section className="h-100 gradient-custom-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="card" style={{ width: "70vw" }}>
                    <div className=" rounded-top text-white d-flex flex-row" style={{ height: "200px", backgroundColor: "#000" }} >
                        <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                            <img src={prof.photo}
                                alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-2"
                                style={{ width: "150px", zIndex: "1" }} />
                        </div>
                        <div className="ms-3" style={{ marginTop: "130px" }}>
                            <h5>{prof.user_name}</h5>
                        </div>
                    </div>
                    <div className="p-4 text-black" style={{ backgroundColor: "#f5f5f5" }}>
                        <div style={{ marginTop: "1%", marginLeft: "5px" }} class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                            <div class="btn-group" role="group" aria-label="First group">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="btn btn-dark">Rate me!</button>
                            </div>
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

            <div class="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Understood</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    );
}

export default Profile;