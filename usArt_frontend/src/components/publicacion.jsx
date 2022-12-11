import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom"
import imageP from '../assets/not-found-image.jpg'
import "./publicacion.css"
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import LINK_BACKEND from "./LINK_BACKEND"
import LINK_FRONTEND from "./LINK_FRONTEND"
import Footer from './footer'

import { HiArchive } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";

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
    const [report, setReport] = useState([])



    let input_textarea = document.querySelector('.content-input');

    const favButton = (
        <button onClick={toggleFavorite} className="button_heart" style={{ verticalAlign: "middle" }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <i style={{ color: color, width: "30px", height: "30px" }} class='fa'>{heart}</i></button>
    )

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
                    console.log(data["detail"])
                    if (data["detail"] !== "Not found.") {
                        setFavorite(true)
                        setHeart(<span>&#xf004;</span>)
                        setColor('red')
                    }
                })
        }
        console.log("user: ", user)
        refreshReports()
    }

    function refreshReports() {
        if (user.is_superuser) {

            fetch(

                LINK_BACKEND + "/api/catalog/complaint/get/post/" + id, {
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
                    console.log("la data es esta: ", data)
                    let finalReports = []
                    data.forEach(async (rep) => {
                        if (rep.status === 'PE') {
                            finalReports.push(rep);
                        }
                    });
                    console.log("los finla reports: ", finalReports)
                    setReport(finalReports);
                }
                )
        }
    }

    function renderReportsUser() {
        console.log("el user: ", user)
        console.log("los reports: ", report)
        if (user.is_superuser && report.length != 0) {
            return (

                <div className='rounded listdenuncia justify-content-center  text-center pt-3 mt-5 mb-5 text-align-center'>
                    <h1 style={{ color: "black", fontWeight: "600", fontSize: "30px" }}>Complains</h1>
                    <div className=' text-center justify-content-center  '>
                        {report.map(renderAllReports)}
                    </div>

                </div>
            )
        }
    }

    function onArchive(e) {
        fetch(
            LINK_BACKEND + "/api/catalog/complaint/put/delete/" + e, {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'AP',
            }),
        })
            .then(data => {
                console.log(data);
                if (data.status === 403) {
                    alert("ERROR: Something went wrong")
                }
            })

        refreshReports()

    }
    function onDelete(e) {
        console.log("entro en el delete")
        fetch(
            LINK_BACKEND + "/api/catalog/complaint/put/delete/" + e, {
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
        refreshReports()

    }

    function renderAllReports(reports) {
        return (
            <div className='d-flex justify-content-between '>
                <div className="rounded  justify-content-center pt-3 mt-4 shadow w-75 align-items-center quejas" style={{ backgroundColor: "RGBA(255,0,0,0.61)" }}>
                    <p>{reports.reason}</p>
                </div>
                <div className='d-flex justify-content-center text-center align-items-center acceptDel'>
                    < HiArchive style={{ fontSize: "35", margin: "10px", cursor: "pointer", name: reports.id }} onClick={onArchive.bind(this, reports.id)} />
                    < AiFillDelete style={{ fontSize: "35", margin: "10px", cursor: "pointer" }} onClick={onDelete.bind(this, reports.id)} />
                </div>

            </div>

        )
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
    function LINK_FRONTENDContact() {
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
    }
    function LINK_FRONTENDProfile() {


        const link = LINK_FRONTEND + "/profile/" + author.user_name + "/default"

        window.location.assign(link)
    }
    function Nameaux() {
        let name = ""
        if (card.type == "CO") {
            name = "Contactar"
        } else {
            name = "Comprar"

        }
        return name
    }
    function updateOutput() {
        let description = input_textarea.value
        if (description.length === 0) {
            alert("La descripción no puede estar vacia")
        }
        console.log(description)
        postPetCom(id, description)
        alert("Petición hecha!")
        document.getElementById("toOpacity").style.opacity = "1"

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
                    <div className="grid template" >
                        <div className="card card-item ">
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
                                <button onClick={LINK_FRONTENDProfile} className="button" style={{ verticalAlign: "middle", width: "100px" }}><span>Perfil </span></button>
                            </div>
                        </div>
                        <div>
                            <div className="custom-container rounded">
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
                                        {authTokens ? favButton : <div></div>}
                                    </div>
                                    <div class="input-group" style={{ marginBottom: "1%", marginRight: "1%" }}>
                                        <button onClick={LINK_FRONTENDContact} className="button" style={{ verticalAlign: "middle" }}><span>Contactar </span></button>
                                    </div>
                                </div>

                            </div>
                            {renderReportsUser()}
                        </div>


                    </div>

                </div>
                <Footer />
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
        </div>
    );
}


export default Publicacion;