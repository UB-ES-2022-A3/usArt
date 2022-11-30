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
    const [products, setProducts] = useState([])

    const [radioGender, setRadioProduct] = useState('Products');
    const handleChange = (event) => {
        setRadioProduct(event.target.value)
    }

    useEffect(callApi, [])
    useEffect(callApiProducts, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/userprofile/" + username)
            .then((res) => res.json())
            .then(data => {
                is_self = data.is_self;
                setProfile(data);
            }
            )
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

    function renderIfRadio() {
        if (radioGender === 'Products') {
            return products.map(RenderMyProducts)
            //return RenderMyProductsMockUp()
        } else if (radioGender === 'Reviews') {

        } else {

        }
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

    return (
        <div>
            <section className="h-100 gradient-custom-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="card" style={{ width: "70vw" }}>
                    <div className=" rounded-top text-white d-flex flex-row" style={{ height: "200px", backgroundColor: "#000" }} >
                        <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                            <img src={prof.photo}
                                alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-2 imgProfile"
                                style={{ zIndex: "1" }} />
                            <button type="button" class="btn btn-outline-dark"
                                style={{ zIndex: "1" }}>
                                Edit profile
                            </button>

                        </div>
                        <div className="ms-3" style={{ marginTop: "130px" }}>
                            <h5>{prof.user_name}</h5>

                        </div>
                    </div>
                    <div className="p-4 text-black" style={{ backgroundColor: "#f5f5f5" }}>
                        <div className="d-flex justify-content-end text-center py-1">
                            <div className="ratings">
                                <div className="empty-stars"></div>
                                <div className="full-stars" style={{ width: '75%' }}></div>
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
                                    <div className="btn-group px-4 py-5 ">
                                        <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChange} />
                                        <label className="btn btn-outline-dark" htmlFor="radio1">My products</label>
                                        <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChange} />
                                        <label className="btn btn-outline-dark" htmlFor="radio2">Reviews</label>
                                        <input type="radio" className="btn-check" name="options" id="radio3" autoComplete="off" value="Purchase" checked={radioGender === 'Purchase'} onChange={handleChange} />
                                        <label className="btn btn-outline-dark" htmlFor="radio3">Purchase History</label>
                                    </div>
                                    <div className="p-4" style={{ backgroundColor: "#f5f5f5" }}>
                                        {renderIfRadio()}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </section>
            <Footer/>
        </div>

    );
}

export default Profile;