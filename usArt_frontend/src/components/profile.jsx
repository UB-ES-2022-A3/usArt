import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import './profile.css';
import { useParams } from "react-router-dom";
import LINK_BACKEND from "./LINK_BACKEND"
import AuthContext from "../context/authcontext";
import Footer from './footer'
import empty from '../assets/suchEmpty.png'
import { Modal } from "bootstrap"
function Profile() {

    const { username } = useParams();
    let { user, authTokens } = useContext(AuthContext);
    const [prof, setProfile] = useState([])
    const [products, setProducts] = useState([])
    const [historialProducts, setHistorialProducts] = useState([])
    const [reviews, setReviews] = useState([])
    const [stars, setStars] = useState(0)
    const [review, setReview] = useState(0)
    const [message, setMessage] = useState('');


    const [radioGender, setRadioProduct] = useState('Products');
    const handleChange = (event) => {
        setRadioProduct(event.target.value)
    }
    useEffect(callApi, [])
    useEffect(callApiProducts, [])
    useEffect(callApiHistorialProducts, [])
    useEffect(callApiReviews, [])

    function callApi() {
        if (user !== null) {
            fetch(
                LINK_BACKEND + "/api/userprofile/" + username, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                }
            })
                .then((res) => res.json())
                .then(data => {
                    setProfile(data);
                }
                )

        } else {
            fetch(
                LINK_BACKEND + "/api/userprofile/" + username)
                .then((res) => res.json())
                .then(data => {
                    setProfile(data);
                }
                )
        }
        takeReview()
    }

    function callApiProducts() {
        fetch(
            LINK_BACKEND + "/api/catalog/user/" + username)
            .then((res) => res.json())
            .then(data => {
                setProducts(data);
            }
            )
    }

    function callApiHistorialProducts() {
        if (user == null) return
        fetch(
            LINK_BACKEND + "/api/userprofile/purchases/", {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                }
            })
                .then((res) => res.json())
                .then(data => {
                    setHistorialProducts(data);
                }
                )
    }

    function callApiReviews() {
        fetch(
            LINK_BACKEND + "/api/userprofile/review-list/" + username)
                .then((res) => res.json())
                .then(data => {
                    setReviews(data);
                }
                )
    }

    function renderIfRadio() {

        if (radioGender === 'Products') {
            if (products.length !== 0) {
                return products.map(RenderMyProducts)
            } else {
                return RenderEmpty()
            }
        } else if (radioGender === 'Reviews') {
            if(reviews.length !== 0){
                return reviews.map(RenderReviews)
            } else {
                return RenderEmpty()
            }
        } else {

            if (historialProducts.length === 0) {
                return RenderEmpty()
            } else {
                return historialProducts.map(RenderMyHistorialProducts)
            }
        }
    }
    function RenderEmpty() {
        return (
            <div>
                <img src={empty} className="" alt="Noel" ></img>
                <p className='py-3' style={{ color: "gray" }}>Wow, such empty</p>
            </div>
        )
    }

    function RenderPurchaseHistory() {

        if (prof.is_self) {
            return (<div className="btn-group px-4 py-5 ">
                <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChange} />
                <label className="btn btn-outline-dark" htmlFor="radio1">My products</label>
                <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChange} />
                <label className="btn btn-outline-dark" htmlFor="radio2">Reviews</label>
                <input type="radio" className="btn-check" name="options" id="radio3" autoComplete="off" value="Purchase" checked={radioGender === 'Purchase'} onChange={handleChange} />
                <label className="btn btn-outline-dark" htmlFor="radio3">Purchase History</label>
            </div>)
        } else {
            return (<div className="btn-group px-4 py-5 ">
                <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChange} />
                <label className="btn btn-outline-dark" htmlFor="radio1">My products</label>
                <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChange} />
                <label className="btn btn-outline-dark" htmlFor="radio2">Reviews</label>
            </div>)
        }
    }

    //#TODO, En teoria habrá una fecha
    function RenderMyHistorialProducts(product) {
        return (
            <a style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + product.id} key={product.id}>
                <div className='d-flex rounded  p-3 productRow text-center align-items-center justify-content-center' style={{ backgroundColor: "white" }}>
                    <img src={product.pub_id.images[0]} className="imageProducts shadow rounded" alt="Sorry! not available at this time" ></img>
                    <div className='col-3  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}><strong>{product.price}€</strong></h1>
                    </div>
                    <div className='col-4  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}>{product.pub_id.description}</h1>
                    </div>
                    <div className='col-2  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}>{product.date}</h1>
                    </div>
                </div>
            </a>
        )
    }

    function RenderMyProducts(product) {
        return (
            <a style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + product.id} key={product.id}>
                <div className='d-flex rounded  p-3 productRow text-center align-items-center justify-content-center' style={{ backgroundColor: "white" }}>
                    <img src={product.images[0]} className="imageProducts shadow rounded" alt="Sorry! not available at this time" ></img>
                    <div className='col-3  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}><strong>{product.price}€</strong></h1>
                    </div>
                    <div className='col-6  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}>{product.description}</h1>
                    </div>
                </div>
            </a>
        )
    }

    function RenderReviews(review) {
        return (
            <a style={{ margin: "1%", textDecoration: 'none' }}>
                <div className='d-flex rounded  p-3 productRow text-center align-items-center justify-content-center' style={{ backgroundColor: "white" }}>
                    <img src={review.reviewer_id.photo} className="imageUsers shadow rounded col-2" alt="Sorry! not available at this time" ></img>
                    <div className='reviewContainer col-10  d-flex  justify-content-center'>
                        <div className='grid' style={{justifyContent: 'center'}}>
                            <div className='row-2'>
                                <h3 style={{color: "black"}}>
                                    <strong>{review.reviewer_id.user_name}</strong>
                                </h3>
                                <div className="ratings">
                                    <div className="empty-stars"></div>
                                    <div className="full-stars" style={{ width: review.stars / 5 * 100 + "%" }} ></div>
                                </div>
                            </div>
                            <div className='row-8 review-row'>
                                <p style={{ color: "black", fontSize: "1em"}}>{review.review}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }
    const handleMessageChange = event => {
        // 👇️ access textarea value
        setMessage(event.target.value);
    };
    function takeReview() {
        fetch(
            LINK_BACKEND + "/api/userprofile/review-artist/" + username)
            .then((res) => res.json())
            .then(data => {
                setReview(data.average / 5 * 100 + "%");
            }
            )
    }
    function sendReview() {
        if (message.length === 0 | stars === 0) {
            document.getElementById("textDes").placeholder = "You must write something and give stars! ";
            return
        }

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
                'review': message
            })
        }).then((res) => res.json())
            .then(data => {

                takeReview()
            }
            )

        document.getElementById("profileOpacity").style.opacity = "1";
    }

    function is_self() {
        if (user == null) return
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
                                    style={{ minWidth: "150px", minHeight: "150px", maxWidth: "150px", maxHeight: "150px", zIndex: "1" }} />
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
                                    <div className="full-stars" style={{ width: review }} ></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 text-black">
                            <div className="mb-1">
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
                                        {RenderPurchaseHistory()}
                                        <div className="p-4" style={{ backgroundColor: "#f5f5f5" }}>
                                            {renderIfRadio()}
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
                            <h5 className="modal-title" id="staticBackdropLabel">Review {username}! :)</h5>
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

                                <textarea id='textDes' maxLength="300" type="text" onChange={handleMessageChange} placeholder="try: you are awesome with the brush" />
                            </div>
                        </div>
                        <div className='modal-footer custom-footer'>
                            <button id="search-btn" onClick={sendReview} disabled={stars == 0 | message.length == 0} data-bs-dismiss="modal" aria-label="Close" className='btn2'>Rate</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >

    );
}

export default Profile;