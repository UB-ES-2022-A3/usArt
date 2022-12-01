import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom"
import imageP from '../assets/not-found-image.jpg'
import "./publicacion.css"
import LINK_BACKEND from "./LINK_BACKEND"
import LINK_FRONTEND from "./LINK_FRONTEND"
import AuthContext from "../context/authcontext";
import { useContext } from 'react';


function Publicacion(props) {

    let { authTokens } = useContext(AuthContext);
    const { id } = useParams()
    const [card, setCard] = useState([])
    const [author, setAuthor] = useState([])
    const [review, setReview] = useState(0)
    const [fav, setFavorite] = useState(false)
    const [heart, setHeart] = useState(<span>&#xf08a;</span>)
    const [color, setColor] = useState('black')

    useEffect(callApi, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/catalog/" + id)
            .then((res) => res.json())
            .then(data => {
                setReview(data.review / 5 * 100 + "%");
                setCard(data);
                console.log(data);
                if (data.images.length === 0) {
                    data.images.push(imageP)
                    setCard(data);
                }
                setAuthor(data.author);
            })

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

    function toggleFavorite() {
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

    if (card.length === 0 || author === undefined) {
        return (
            <div className='center'>
                <div class="loader">
                    <div className="loader-wheel"></div>
                    <div className="loader-text"></div>
                </div>
            </div>)
    }


    function renderCard(card, index) {
        card = LINK_BACKEND + card
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
        const link = LINK_FRONTEND + "/message/" + author.id;
        window.location.assign(link)
    }
    function LINK_FRONTENDProfile() {

        const link = LINK_FRONTEND + "/profile/" + author.user_name
        window.location.assign(link)
    }


    return (

        <div className="main" style={{ minHeight: "88vh", backgroundColor: "white", marginInlineStart: "5%", marginInlineEnd: "5%", borderRadius: "20px", marginBlockEnd: "1%" }}>
            <div className="grid template"  >
                <div className="card card-item">
                    <div className="grid " style={{ marginInlineStart: "1%", minHeight: "0%", justifyContent: "normal" }}>
                        <picture >
                            <img src={LINK_BACKEND + '/media/' + author.photo} className="card-img-top size-img-card" alt="Sorry! not available at this time"></img>
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
                            <h1 style={{ color: "black" }}>{card.title}</h1>
                        </div >
                        <h4 style={{ color: "black" }}>{card.price}€</h4>
                        <hr></hr>
                        <p placeholder="Description not found.." style={{ color: "black" }}>{card.description}</p>

                    </div>
                    <hr style={{ marginInlineStart: "30px", marginInlineEnd: "30px" }}></hr>
                    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group" role="group" aria-label="First group" style={{ marginBottom: "1%", marginLeft: "1%" }}>
                            <button onClick={toggleFavorite} className="button_heart" style={{ verticalAlign: "middle" }}>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                                <i style={{ color: color, width: "30px", height: "30px"}} class='fa'>{heart}</i></button>
                        </div>
                        <div class="input-group" style={{ marginBottom: "1%", marginRight: "1%" }}>
                            <button onClick={LINK_FRONTENDContact} className="button" style={{ verticalAlign: "middle" }}><span>Contactar </span></button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}


export default Publicacion;