//import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';

import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import LINK_FRONTEND from "./LINK_FRONTEND";
import AuthContext from "../context/authcontext";

import './register.css'
import Footer from './footer';
import LINK_BACKEND from "./LINK_BACKEND"
import { useParams } from "react-router-dom"

import { Modal } from 'bootstrap'

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
                setEmailCreator(data.pub_id.author.email)
                setEmailUser(data.user_id.email)
                setUsername(data.user_id.user_name)
                setPrice(data.price)
                setFecha(data.date)
                //setImagen(data.Imagen)

            }
            )

    }

    const [modal, setModal] = useState()

    const [emailUser, setEmailUser] = useState(null)
    const [emailCreator, setEmailCreator] = useState(null)


    function LINK_FRONTENDContact() {
        var coModal = new Modal(document.getElementById('coModal'), {
            keyboard: false
        })
        setModal(coModal)
        coModal.show()

    }

    var input_textarea_description = document.getElementById('modal_reason');

    function updateOutput() {
        var description = input_textarea_description.value
        if (description.length === 0) {
            alert("Please fill the textfield explaining the reason!")
        }
        else {
            postComplain(description)
            window.location.assign(LINK_FRONTEND + "/home")

        }
    }

    function postComplain(description) {
        // Aqui hem de enviar el correu 
        if(emailCreator != null && emailUser != null){
            window.open('mailto:' + emailCreator + '?subject=Refund inquiry&body='+ description);
            //window.location.href = 'mailto:'+emailCreator+'?cc='+''+'&subject='+'Refund inquiry'+'&body='+description;

            /*var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    console.log(xhttp.responseText);
                }
            }
            xhttp.open('GET', 'https://mandrillapp.com/api/1.0/messages/send.json?message[from_email]=mail@7995.by&message[to][0][email]=zdanevich.vitaly@yaa.ru&message[subject]=Заявка%20с%207995.by&message[html]=xxxxxx&key=oxddROOvCpKCp6InvVDqiGw', true);
            xhttp.send();*/

            alert("Your complain has been sent to the creator with email: " + emailCreator)

        }
        else{
            alert("There was an error sending your inquiri, contact us to resolve this issue.")
        }
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
                            <button className="button" onClick={LINK_FRONTENDContact} style={{ verticalAlign: "middle", width: "100px" , backgroundColor:"darkred"}} >Refund</button>
                            <div class="modal" id="coModal" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content upload-modal">
                                        <div class="modal-header" style={{ marginTop: "-5%" }} >
                                            <h5 class="modal-title text-dark" style={{position:"relative"}}>Tell us why do you want to return this item</h5>
                                        </div>
                                        <p><textarea style={{position:"relative"}} name="reason" className="content-input" rows="5" cols="60" id="modal_reason" required ></textarea></p>
                                        <button className="button" onClick={updateOutput} style={{ verticalAlign: "middle", width: "100px"}}>Send</button>
                                        <button className="button" onClick={() => window.location.assign(LINK_FRONTEND + "/home")} data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }} >Cancel</button>
                                    </div>
                                </div>
                            </div>
                            <button className="button" onClick={() => window.location.assign(LINK_FRONTEND + "/home")} data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }} >Close</button>
                        </div>
                    </MDBCardBody>
                </MDBCard>

            </MDBContainer>


        </div>


    );
}


export default Details;