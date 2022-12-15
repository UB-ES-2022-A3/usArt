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
    const [formValues, setFormValues] = useState({})
    const [stateImages, setStateImages] = useState([])
    const [modal, setModal] = useState()

    const { data, fullScreen, loading } = stateImages;
    const previewClasses = ['preview', fullScreen ? 'preview--fullscreen' : ''].join(' ');
    const [report, setReport] = useState([])



    let input_textarea = document.querySelector('.content-input');
    let input_reason = document.querySelector('.reason-input');

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
        if (!authTokens) return
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
                    let finalReports = []
                    data.forEach(async (rep) => {
                        if (rep.status === 'PE') {
                            finalReports.push(rep);
                        }
                    });
                    setReport(finalReports);
                }
                )
        }
    }

    function renderReportsUser() {
        if (!authTokens) return
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
                if (data.status === 403) {
                    alert("ERROR: Something went wrong")
                }
            })

        refreshReports()
        window.location.assign(LINK_FRONTEND + "/publicacion/" + id)

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
        window.location.assign(LINK_FRONTEND + "/publicacion/" + id)

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
    function renderButtons(cards, index) {
        let label_i = "Slide " + (index + 1)
        let index_ = (index)
        if (card.images.length === 1) return
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
        console.log("este es el user", user)
        if (authTokens) {

            if (author['id'] == user['user_id'] || user.is_superuser === true) {
                return (
                    <button onClick={deleteOnClick} className="button" style={{ verticalAlign: "middle" }}><span>Delete</span></button>
                )
            } else {
                return (
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
        if (author['id'] != user['user_id'] && user.is_superuser == false) {
            return (<div>
                {favButton}
                <button onClick={complaintPopUp} className="button_heart" style={{ verticalAlign: "middle" }}>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <i title="Report" style={{ color: "#000000", fontSize: "43px", marginTop: "2px" }} class='fa'>&#x1F5E3;</i>
                </button>
            </div>
            )
        } else {
            return (
                <button onClick={LINKUpdate} className="button_update" style={{ verticalAlign: "middle" }}><span>Update</span></button>
            )
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
        }).then((res) => {
            LINK_FRONTENDProfile()
            return res.json()
        })
        if (user.is_superuser == true) {
            window.location.assign(LINK_FRONTEND + "/explore")
        } else {
            LINK_FRONTENDProfile()
        }
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

    async function LINK_FRONTENDContact() {

        if (authTokens) {
            let coModal = new Modal(document.getElementById('coModal'), {
                keyboard: false, backdrop: 'static'
            })
            try {
                const response = await fetch(
                    LINK_BACKEND + "/api/userprofile/blocked/" + author.id, {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Authorization': 'Bearer ' + authTokens.access,
                        'Content-Type': 'application/json'
                    },
                })
                if (!response.ok) {
                    const response = await fetch(
                        LINK_BACKEND + "/api/userprofile/blocker/" + author.id, {
                        method: 'GET',
                        withCredentials: true,
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + authTokens.access,
                            'Content-Type': 'application/json'
                        },
                    })
                    if (response.ok) {
                        alert("You block this user")

                    } else {
                        if (card.type === "CO") {
                            document.getElementById("toOpacity").style.opacity = "0.5";
                            coModal.show()
                        } else if (card.type === "AR") {
                            document.getElementById("toOpacity").style.opacity = "0.5";
                            const link = LINK_FRONTEND + "/compra/" + id
                            window.location.assign(link)
                        } else if (card.type === "AU") {
                            document.getElementById("toOpacity").style.opacity = "0.5";
                            const link = LINK_FRONTEND + "/auction/" + id
                            window.location.assign(link)
                        }

                    }
                } else {
                    alert("This user blocked you")
                }
            } catch (error) { }

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
        console.log(card.type)
        if (card.type == "CO") {
            name = "Contact"
        } else if (card.type == "AR") {
            name = "Buy"
        } else {
            name = "Bid"
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

    //-----------------------------------------update
    let input_textarea_title = document.getElementById('titlepost');
    let input_textarea_description = document.getElementById('descriptionpost');
    let input_textarea_price = document.getElementById('pricepost');

    const handleFileChange = (event) => {
        const { target } = event;
        const { files } = target;
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onloadstart = () => setStateImages([{ loading: true }]);
            reader.onload = event => {
                setStateImages([...stateImages, {
                    data: event.target.result,
                    loading: false,
                    target: URL.createObjectURL(files[0])
                }])
            };
        };

        reader.readAsDataURL(files[0]);
    }

    const handlePreviewClick = () => {
        const { data, fullScreen } = stateImages;
        if (!data) {
            return;
        }
        setStateImages({ fullScreen: !fullScreen });
    };

    function updateOutputUpdate() {
        var title = input_textarea_title.value
        var description = input_textarea_description.value
        var price = input_textarea_price.value
        let images = []
        if (stateImages.length > 0) {
            stateImages.forEach(element => {
                images.push(element.data)
            });
        }
        if (title.length === 0 || description.length === 0 || price.length === 0) {
            alert("Fields cannot be empty!")

        }
        else {
            updateArt(title, description, price, images)

        }
    }
    function updateArt(title, description, price, images) {
        fetch(LINK_BACKEND + "/api/catalog/manage/update/", {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'pub_id': id,
                'title': title,
                'description': description,
                'price': price,
                'images': images
            }),
        })
            .then((res) => {
                if (res.status !== 201) alert("Error uploading")
                callApi()
                modal.hide()
                return res.json()
            })
        document.getElementById("toOpacity").style.opacity = "1";
    }

    function LINKUpdate() {
        document.getElementById("toOpacity").style.opacity = "0.5"
        var coModal = new Modal(document.getElementById('coModalUpdate'), {
            keyboard: false
        })
        setModal(coModal)
        coModal.show()

    }
    const handleChangePosting = (e) => {
        const { type, value } = e.target;
        setFormValues({ ...formValues, [type]: value });
    };
    function checkNumbers(e) {

        if (input_textarea_price.value > 6) {
            if (input_textarea_price.value[5] === ".") input_textarea_price.value = input_textarea_price.value.slice(0, 4);
            else { input_textarea_price.value = input_textarea_price.value.slice(0, 6); }
        }
    }
    const handleClearClick = (e) => {
        let fileReader = stateImages.filter(function (value, index, arr) {

            return value.target !== e.src & e.accessKey !== index;
        });
        setStateImages(fileReader)

    };
    function showImages(images, key) {

        if (stateImages.length === 0) return
        return (
            <div class="image-div">
                <img key={key} id={"image" + key} accessKey={key} style={{ margin: "5px", borderRadius: "20px" }} src={images.target} className="size-img stack-images" alt="Img selected"></img>
                <div onClick={() => handleClearClick(document.getElementById("image" + key))} class="trashContainer hidden_img">
                    <div class="trash">
                        <div class="tap">
                            <div class="tip"></div>
                            <div class="top"></div>
                        </div>
                        <div class="tap2">
                            <div class="bottom">
                                <div class="line"></div>
                                <div class="line"></div>
                                <div class="line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function showWarning(images, key) {

        if (stateImages.length === 0) return
        return (<div><p>Warning! This images will substitute your publication images</p></div>
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
                                <button onClick={LINK_FRONTENDProfile} className="button" style={{ verticalAlign: "middle", width: "100px" }}><span>Profile </span></button>
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
                                    {card.images.length > 1 ?
                                        <div><button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button> </div>
                                        : <div></div>}
                                </div>
                                <div className="card-body custom-body ">
                                    <div className="grid" style={{ justifyContent: "left", marginInlineStart: "0%", alignItems: "center" }}>
                                        <h1 style={{ color: "black", marginTop: "3%" }}>{card.title}</h1>
                                    </div >
                                    <h4 style={{ color: "black" }}>{card.type === "AU" ? "Initial price: " + card.price : card.price}€</h4>
                                    <hr></hr>
                                    <p placeholder="Description not found.." style={{ color: "black" }}>{card.description}</p>

                                </div>
                                <hr style={{ marginInlineStart: "30px", marginInlineEnd: "30px" }}></hr>
                                <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                    <div class="btn-group" role="group" aria-label="First group" style={{ marginBottom: "1%", marginLeft: "1%" }}>
                                        {renderFavButtons()}
                                    </div>
                                    <div class="input-group" style={{ marginBottom: "1%", marginRight: "1%" }}>
                                        {renderDelContactButton()}
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
            <div className="modal fade" id="deleteModal" tabIndex="-1">
                <div className="modal-dialog" style={{ width: '400px', textAlign: "center" }}>
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
            <div class="modal" id="coModalUpdate" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content upload-modal">
                        <div class="modal-header" style={{ marginTop: "-5%" }} >
                            <h5 class="modal-title text-dark">Update</h5>
                            <button onClick={() => document.getElementById("toOpacity").style.opacity = "1"} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div >
                                <p>Title:</p>
                                <input defaultValue={card.title} style={{ marginBottom: "2%" }} name="title" type="text" class="content-input-title" id="titlepost" required />
                            </div>
                            <div>
                                <p>Description:</p>
                                <textarea defaultValue={card.description} name="description" class="content-input" id="descriptionpost" rows="4" cols="50" required ></textarea>
                            </div>
                            <div>
                                <p>Price:</p>
                                <p><input defaultValue={card.price} name="price" type="number" onInput={checkNumbers} id='pricepost'  ></input> €</p>
                            </div>
                            <p>Attach some images:</p>
                            {showWarning()}
                            <div style={{ display: "flex" }}>
                                <input
                                    type="file"
                                    name="file-input"
                                    id="file-input"
                                    class="file-input__input"
                                    accept="image/*"
                                    capture="camera"
                                    onChange={handleFileChange}
                                />
                                <label class="file-input__label" for="file-input" style={{ padding: "0", marginRight: "2%" }}>
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="upload"
                                        accept="image/*"
                                        class="svg-inline--fa fa-upload fa-w-16"
                                        role="img"
                                        capture="camera"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                        ></path>
                                    </svg>
                                    <div
                                        className={previewClasses}
                                        onClick={handlePreviewClick}
                                    >

                                        {loading &&
                                            <span>Loading...</span>
                                        }
                                    </div>
                                    <span>Upload new picture </span></label>
                            </div>
                            <div className='row'>
                                <div className="col-sm" style={{ margin: "1%" }}>
                                    {stateImages.map(showImages)}
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer" style={{ marginBottom: "-8%" }}>
                            <button onClick={() => document.getElementById("toOpacity").style.opacity = "1"} class="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Close</button>
                            <button onClick={updateOutputUpdate} class="button" id='sendButton' style={{ verticalAlign: "middle", width: "100px" }}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="complaintModal" tabIndex="-1">
                <div className="modal-dialog" style={{ width: '400px', textAlign: "center" }}>
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
    )
}
export default Publicacion;