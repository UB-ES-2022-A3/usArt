import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';

import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import LINK_FRONTEND from "./LINK_FRONTEND";
import AuthContext from "../context/authcontext";

import './register.css'
import Footer from './footer';
import LINK_BACKEND from "./LINK_BACKEND"
import { useParams } from "react-router-dom"




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




function Details(props) {
    let { authTokens } = useContext(AuthContext);
    const { id } = useParams()
    const [username, setUsername] = useState("")
    const [fecha, setFecha] = useState("")
    const [price, setPrice] = useState("")
    const [Direccion, setDireccion] = useState("")
    const [Tiempodeentrega, setTiempodeentrega] = useState("")
    const [Imagen, setImagen] = useState([])
    console.log(id)
    useEffect(getCompra, [])
    function getCompra() {
        fetch(LINK_BACKEND + "/api/userprofile/purchases/" + id, {
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then(data => {

                console.log(id)
                console.log(data)
                setImagen(data.pub_id.images[0])
                setUsername(data.user_id.user_name)
                setPrice(data.price)
                setFecha(data.date)
                //setImagen(data.Imagen)

            }
            )

    }


    return (
        <div className='body_register'>
            <MDBContainer className="vertical-center " >
                <MDBCard className='text-black m-5 items-align-center shadow' style={{ borderRadius: '25px' }}>
                    <MDBCardBody className='shadow' style={{ display: "flex" }}>

                        <MDBCardImage src={Imagen} style={{ width: "400px", height: "340px" }} fluid />
                        <MDBRow>
                            <p id="title_signup" className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#001a1a" }}>Detalles de tu compra</p>


                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                                <div className="" >
                                    <p><strong>Nombre de usuario: </strong>{username}</p>
                                </div>
                                <div className="" >
                                    <p><strong>Dirección: </strong>Muntaner 214</p>
                                </div>

                                <div className="" >
                                    <p><strong>Fecha de la compra: </strong>{fecha}</p>
                                </div>

                            </MDBCol>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                                <div className="w-50 text-center align-items-center">
                                    <div className="" >
                                        <p><strong>Precio: </strong>{price}</p>
                                    </div>
                                    <div className="" >
                                        <p><strong>Status: </strong>Procesando</p>
                                    </div>

                                </div>
                            </MDBCol>


                        </MDBRow>
                        <div className="" style={{bottom:"0",position:"absolute",right:"0"}}>
                            <button className="button" onClick={() => window.location.assign(LINK_FRONTEND + "/home")} data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }} >Close</button>
                        </div>
                    </MDBCardBody>
                </MDBCard>

            </MDBContainer>


        </div>


    );
}


export default Details;