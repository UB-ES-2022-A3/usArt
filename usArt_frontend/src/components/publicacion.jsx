import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom"
import imageP from '../assets/not-found-image.jpg'
import "./publicacion.css"
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import LINK_BACKEND from "./LINK_BACKEND"
import LINK_FRONTEND from "./LINK_FRONTEND"
import Footer from './footer'

import { Modal } from 'bootstrap'
import AuthContext from "../context/authcontext";

function Publicacion(props) {

    let { user, authTokens } = useContext(AuthContext);
    const { id } = useParams()
    const [card, setCard] = useState([])
    const [author, setAuthor] = useState([])
    const [review, setReview] = useState(0)
    const [fav, setFavorite] = useState(false)
    const [heart, setHeart] = useState(<span>&#xf08a;</span>)
    const [color, setColor] = useState('black')

    let input_textarea = document.querySelector('.content-input');
    let input_reason = document.querySelector('.reason-input');


    useEffect(callApi, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/catalog/" + id)
            .then((res) => res.json())
            .then(data => {
                setCard(data);
                if (data.images.length === 0) {
                    data.images.push(imageP)
                    setCard(data);
                }
                setAuthor(data.author);
                fetch(
                    LINK_BACKEND + "/api/userprofile/review-artist/" + data.author.user_name)
                    .then((res) => res.json())
                    .then(data => {
                        setReview(data.average / 5 * 100 + "%");
                    }
                    )
            }
            )
        if (authTokens) {
            fetch(
                LINK_BACKEND + "/api/userprofile/get/delete/fav/" + id, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                    'Content-Type': 'application/json'
                },
            })
                .then((res) => res.json())
                .then(data => {
                    if (data["detail"] !== "Not found.") {
                        setFavorite(true)
                        setHeart(<span>&#xf004;</span>)
                        setColor('red')
                    }
                })
        }
    }

    function toggleFavorite() {
        if (authTokens) {
            if (!fav) {
                setFavorite(true)
                setHeart(<span>&#xf004;</span>)
                setColor('red')
                fetch(LINK_BACKEND + "/api/userprofile/fav/", {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.access,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'pub_id': id,
                    }),
                })
                    .then((res) => res.json())
                    .then(data => {
                        console.log(data)
                    }
                    )
            } else {
                setFavorite(false)
                setHeart(<span>&#xf08a;</span>)
                setColor('black')
                fetch(
                    LINK_BACKEND + "/api/userprofile/get/delete/fav/" + id, {
                    method: 'DELETE',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.access,
                        'Content-Type': 'application/json'
                    },
                })
                    .then(data => {
                        console.log(data);
                    })
            }
        }
    }

    if (card.length === 0 || author === undefined) {
        return (
            <div className='center'>
                <div className="loader">
                    <div className="loader-wheel"></div>
                    <div className="loader-text"></div>
                </div>
            </div>)
    }

    function renderCard(card, index) {
        if (index === 0) return (
            <div className="carousel-item active" data-bs-interval="30000">
                <img id={index} src={card} className="img-slider" alt="Sorry! not available at this time" ></img>
            </div>
        )
        return (
            <div className="carousel-item" data-bs-interval="30000">
                <img id={index} src={card} className="img-slider" alt="..."></img>
            </div>
        )
    }
    function renderButtons(card, index) {
        let label_i = "Slide " + (index + 1)
        let index_ = (index)
        if (index_ === 0) {
            return (
                <button className="active" key={index}
                    type="button" data-bs-target="#carouselExampleControls" data-bs-slide-to={index_}
                    aria-label={label_i} aria-current="true" ></button>
            )
        }


        return (
            <button key={index}
                type="button" data-bs-target="#carouselExampleControls" data-bs-slide-to={index_}
                aria-label={label_i}></button>
        )
    }

    function renderDelContactButton() {
        if (authTokens) {
            if (author['id'] == user['user_id']) {
                return (
                    <button onClick={deleteOnClick} className="button" style={{ verticalAlign: "middle" }}><span>Delete</span></button>
                )
            } else {
                return(
                    <button onClick={LINK_FRONTENDContact} className="button" style={{ verticalAlign: "middle" }}><span>{Nameaux()}</span></button>
                )
            }
        } else {
            return (
                <button onClick={LINK_FRONTENDContact} className="button" style={{ verticalAlign: "middle" }}><span>{Nameaux()}</span></button>
            )
        }

    }

    function renderFavButtons() {
        if (!authTokens) {
            return (<div></div>)
        }
        if (author['id'] != user['user_id']) {
            return (
                <button onClick={toggleFavorite} className="button_heart" style={{ verticalAlign: "middle" }}>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <i style={{ color: color, fontSize: "35px"}} class='fa'>{heart}</i></button>
            )
        } else {
            return (<div></div>)
        }
    }

    function deleteConfirm() {
        fetch(
            LINK_BACKEND + "/api/catalog/delete/" + id, {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
        })
            .then(data => {
                console.log(data);
            })
        LINK_FRONTENDProfile()
        document.getElementById("toOpacity").style.opacity = "1";
    }

    function deleteOnClick() {
        let delModal = new Modal(document.getElementById('deleteModal'), {
            keyboard: false, backdrop: 'static'
        })
        document.getElementById("toOpacity").style.opacity = "0.5";
        delModal.show()
    }

    function complaintPopUp() {
        let compModal = new Modal(document.getElementById('complaintModal'), {
            keyboard: false, backdrop: 'static'
        })
        document.getElementById("toOpacity").style.opacity = "0.5";
        compModal.show()
    }

    function LINK_FRONTENDContact() {
        if (authTokens) {
            let coModal = new Modal(document.getElementById('coModal'), {
                keyboard: false, backdrop: 'static'
            })

            if (card.type === "CO") {
                document.getElementById("toOpacity").style.opacity = "0.5";

                coModal.show()
            } else {
                document.getElementById("toOpacity").style.opacity = "0.5";
                const link = LINK_FRONTEND + "/compra/" + id
                window.location.assign(link)
            }
        } else {
            alert("You must be logged!")
        }

    }
    function LINK_FRONTENDProfile() {


        const link = LINK_FRONTEND + "/profile/" + author.user_name + "/default"

        window.location.assign(link)
    }
    function Nameaux() {
        let name = ""
        if (card.type == "CO") {
            name = "Contact"
        } else {
            name = "Buy"
        }
        return name
    }
    function updateOutput() {
        let description = input_textarea.value
        if (description.length === 0) {
            alert("La descripción no puede estar vacia")
            input_textarea.value = ""
        }
        console.log(description)
        postPetCom(id, description)
        alert("Petición hecha!")
        document.getElementById("toOpacity").style.opacity = "1"
        input_textarea.value = ""
    }

    function complaintConfirm() {
        let reason = input_reason.value
        if (reason.length === 0) {
            complaintPopUp()
            alert("Reason can't be empty")
        } else {
            fetch(LINK_BACKEND + "/api/catalog/complaint/get/post/" + id, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'reason': reason
                }),
            })
                .then((res) => res.json())
                .then(data => {
                    console.log(data)
                }
                )
            alert("Complaint done!")
            document.getElementById("toOpacity").style.opacity = "1"
            input_reason.value = ""
        }
    }

    function cancelComplaint() {
        document.getElementById("toOpacity").style.opacity = "1"
        input_reason.value = ""
    }

    function postPetCom(pub_id, description) {
        fetch(LINK_BACKEND + "/api/catalog/user/commission/post/", {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'pub_id': pub_id,
                'description': description
            }),
        })
            .then((res) => res.json())
            .then(data => {
                console.log(data)
            }
            )
    }
    return (
        <div>
            <div id='toOpacity'>
                <div className="main" style={{ minHeight: "88vh", backgroundColor: "white", marginInlineStart: "5%", marginInlineEnd: "5%", borderRadius: "20px", marginBlockEnd: "1%" }}>
                    <div className="grid template"  >
                        <div className="card card-item">
                            <div className="grid " style={{ marginInlineStart: "1%", minHeight: "0%", justifyContent: "normal" }}>
                                <picture >
                                    <img src={author.photo} className="card-img-top size-img-card" alt="Sorry! not available at this time"></img>
                                </picture>
                                <h1 style={{ color: "black", marginLeft: "3%" }}>{card.author.user_name}</h1>
                                <div className="ratings">
                                    <div className="empty-stars"></div>
                                    <div className="full-stars" style={{ width: review }}></div>
                                </div>
                                <div className="card-body" style={{ paddingTop: "0%" }}>
                                </div>
                            </div>
                            <hr></hr>
                            <div style={{ marginLeft: "2%" }}>
                                <h5 className="card-title" style={{ color: "black" }}>Descripcion</h5>
                                <p placeholder="Description not found.." className="card-text">{author.description}</p>
                            </div>
                            <hr></hr>
                            <div style={{ bottom: "0", right: "0", position: "absolute", marginRight: "2%", marginBottom: "2%" }}>
                                <button onClick={LINK_FRONTENDProfile} className="button" style={{ verticalAlign: "middle", width: "100px" }}><span>Profile </span></button>
                            </div>
                        </div>
                        <div className="custom-container">
                            <div id="carouselExampleControls" className="carousel carousel-dark  slide" data-bs-ride="carousel"  >
                                <div className="carousel-indicators">
                                    {card.images.map(renderButtons)}
                                </div>
                                <div className="carousel-inner " >
                                    {card.images.map(renderCard)}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                            <div className="card-body custom-body ">
                                <div className="grid" style={{ justifyContent: "left", marginInlineStart: "0%", alignItems: "center" }}>
                                    <h1 style={{ color: "black", marginTop: "3%" }}>{card.title}</h1>
                                </div >
                                <h4 style={{ color: "black" }}>{card.price}€</h4>
                                <hr></hr>
                                <p placeholder="Description not found.." style={{ color: "black" }}>{card.description}</p>

                            </div>
                            <hr style={{ marginInlineStart: "30px", marginInlineEnd: "30px" }}></hr>
                            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group" role="group" aria-label="First group" style={{ marginBottom: "1%", marginLeft: "1%" }}>
                                    {renderFavButtons()}
                                    <button onClick={complaintPopUp} className="button_heart" style={{ verticalAlign: "middle" }}>
                                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                                        <i title="Report" style={{ color: "#000000", fontSize: "43px", marginTop: "2px"}} class='fa'>&#x1F5E3;</i>
                                    </button>
                                </div>
                                <div class="input-group" style={{ marginBottom: "1%", marginRight: "1%" }}>
                                    {renderDelContactButton()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>

            </div>
            <div className="modal fade" id="coModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark" id="modal_title">Que servicio quieres adquirir del artista?</h5>
                            <button type="button" className="btn-close" onClick={() => document.getElementById("toOpacity").style.opacity = "1"} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <p><textarea name="comentario" className="content-input" rows="5" cols="60" id="modal_review" required ></textarea></p>

                        </div>

                        <div className="modal-footer">
                            <button className="button" id="close_button" onClick={() => document.getElementById("toOpacity").style.opacity = "1"} data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Close</button>
                            <button onClick={updateOutput} id="send_button" className="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Send </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deleteModal" tabIndex="-1">
                <div className="modal-dialog" style={{ width: '400px', textAlign: "center"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-dark" id="modal_title">Are you sure you want delete this publication?</h4>
                        </div>
                        <div className="modal-footer">
                            <button className="button" id="close_button" onClick={() => document.getElementById("toOpacity").style.opacity = "1"} data-bs-dismiss="modal" style={{ marginRight: "24.5%", verticalAlign: "middle", width: "100px" }}>Cancel</button>
                            <button onClick={deleteConfirm} id="send_button" className="button" data-bs-dismiss="modal" style={{ marginRight: "10%", verticalAlign: "middle", width: "100px" }}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="complaintModal" tabIndex="-1">
                <div className="modal-dialog" style={{ width: '400px', textAlign: "center"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-dark" id="modal_title">Reason for the complaint?</h4>
                        </div>
                        <div className="modal-body">
                            <p><textarea name="reason" className="reason-input" rows="5" cols="45" id="reason" maxlength="300" required ></textarea></p>
                        </div>
                        <div className="modal-footer">
                            <button className="button" id="close_button" onClick={cancelComplaint} data-bs-dismiss="modal" style={{ marginRight: "24.5%", verticalAlign: "middle", width: "100px" }}>Cancel</button>
                            <button onClick={complaintConfirm} id="send_button" className="button" data-bs-dismiss="modal" style={{ marginRight: "10%", verticalAlign: "middle", width: "100px" }}>Complaint</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Publicacion;