import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';

import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import LINK_FRONTEND from "./LINK_FRONTEND";
import AuthContext from "../context/authcontext";

import './register.css'
import Footer from './footer';
import LINK_BACKEND from "./LINK_BACKEND"
import { useParams } from "react-router-dom"


import { useNavigate} from 'react-router-dom';


import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
}
    from 'mdb-react-ui-kit';




function Compra(props) {

    let { authTokens } = useContext(AuthContext);
    const initialValues = { username: "", email: "", Direccion: "", CodigoPostal: "", Num: "", Fecha: "", ccv: "" };
    let initialValue = false;

    const { id } = useParams()

    const [formValues, setFormValues] = useState(initialValues);
    const [checkValue, setCheckValue] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState();



    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

    };


    const handleSubmit = (e) => {
        e.preventDefault();
        let errors = (validate(formValues, checkValue));
        setFormErrors(errors)
        setIsSubmit(true);
        if (Object.keys(errors).length === 0) {
            postCompra(formValues.username, formValues.email, formValues.CodigoPostal,formValues.Direccion, formValues.Num, formValues.Fecha, formValues.ccv)
        }
    };
    function postCompra(user_name, email, CodigoPostal, Direccion, Num, Fecha, ccv) {
        if (Object.keys(validate(formValues, checkValue)).length === 0) {
            fetch(LINK_BACKEND + "/api/catalog/" + id)
                .then((res) => res.json())
                .then(data => {
                    fetch(LINK_BACKEND + "/api/userprofile/purchases/", {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + authTokens.access,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'pub_id': id,
                            'price': data.price,
                            'address': Direccion

                        })
                    })

                        .then(function (response) {
                            if (response.status === 201) {
                                return response.json();
                            } else {
                                alert("No se ha podido realizar la compra")
                            }
                        })
                        .then(function (data) {
                            const items = data;
                            console.log(items.id)
                            const link = LINK_FRONTEND + "/purchasedetails/" + items.id

                            window.location.assign(link)

                        }
                        )


                }
                )
        }
    }

    const validate = (values, checkValue) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        var usernameRegex = /^[a-zA-Z0-9.\$]{3,30}$/;

        if (!values.username) {
            errors.username = "Username is required!";
        } else if (values.username.length < 3) {
            errors.username = "Username must be 3 characters or more! ";
        }
        else if (!usernameRegex.test(values.username)) {
            errors.username = "Username must not contain special characters";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }

        if (!values.Direccion) {
            errors.Direccion = "Direction is required";
        }
        if (!values.CodigoPostal) {
            errors.CodigoPostal = "CodigoPostal is required";
        }
        if (!values.Num) {
            errors.Num = "Numero is required";
        } else if (values.Num.length != 16) {
            errors.Num = "Numero has diferent length than expected"
        }
        if (!values.Fecha) {
            errors.Fecha = "Fecha is required";
        } else if (usernameRegex.test(values.Fecha)) {
            errors.Fecha = "/ is required";
        } else if (values.Fecha.length != 5) {
            errors.Fecha = "Fecha caducidad targeta has diferent length than expected";
        }
        if (!values.ccv) {
            errors.ccv = "CCV is required";
        } else if (values.ccv.length != 3) {
            errors.ccv = "CCV has diferent length than expected"
        }
        console.log(errors)
        return errors;
    };
    const navigate = useNavigate();
    return (
        <div className='body_register'>
            <MDBContainer className="vertical-center " >
                <MDBCard className='text-black m-5 items-align-center shadow' style={{ borderRadius: '25px' }}>
                    <MDBCardBody className='shadow'>
                        <a onClick={() => navigate(-1)} style={{cursor:"pointer"}} ><BsFillArrowLeftSquareFill size='30' className='mx-3 my-3 shadow' /></a>
                        <MDBRow>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                                <p id="title_signup" className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#001a1a" }}>Purchase Process</p>
                                <form className="w-50 text-center align-items-center" onSubmit={handleSubmit}>
                                    <div className="">
                                        <MDBInput name="username" id='form1' type='text' placeholder="Name of the Cardholder" className='w-100 shadow-sm ' value={formValues.username} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.username}</p>
                                    <div className="">
                                        <MDBInput id='form2' name="email" type='email' className='shadow-sm' placeholder="Email" value={formValues.email} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.email}</p>
                                    <div className=" ">
                                        <MDBInput id='form4' name="Direccion" placeholder="Address" className='shadow-sm' value={formValues.Direccion} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.Direccion}</p>

                                    <div className=" ">
                                        <MDBInput id='form3' name="CodigoPostal" placeholder="Postal Code" className='shadow-sm' value={formValues.CodigoPostal} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.CodigoPostal}</p>

                                    <div className=" ">
                                        <MDBInput id='form3' name="Num" placeholder="Card Number" className='shadow-sm' value={formValues.Num} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.Num}</p>
                                    <div className=" ">
                                        <MDBInput id='form3' name="Fecha" placeholder="Expiration Date" className='shadow-sm' value={formValues.Fecha} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.Fecha}</p>
                                    <div className=" ">
                                        <MDBInput id='form3' name="ccv" placeholder="CCV" className='shadow-sm' value={formValues.ccv} onChange={handleChange} />
                                    </div>
                                    <p className='text-danger mb-3'>{formErrors.ccv}</p>
                                    <button id='register_button' type="button" onClick={handleSubmit} className="btn btn-primary shadow mb-3 mt-3" >Purchase</button>
                                </form>
                                <p className='text-danger'>{serverError}</p>



                            </MDBCol>
                            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                <MDBCardImage src="https://www.4webs.es/blog/wp-content/uploads/2017/06/ampliar-la-vida-del-carrito-de-compra-prestashop-1.7.jpg" fluid />
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

            </MDBContainer>
        </div>


    );
}


export default Compra;