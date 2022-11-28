import React from 'react';
import { useState } from 'react';
import './register.css';
import LINK_BACKEND from "./LINK_BACKEND";
import LINK_FRONTEND from "./LINK_FRONTEND";
import cookie from 'react-cookies';
import axios, * as others from 'axios';
import { useContext } from "react";

import AuthContext from "../context/authcontext";


import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput
}
  from 'mdb-react-ui-kit';

function Login() {
  const { loginUser } = useContext(AuthContext);

  const [formErrors, setFormErrors] = useState();
  const [formResponse, setFormResponse] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    console.log(username);
    console.log(password);
    username.length > 0 && loginUser(username, password)
  };

  return (
    <div>
   <MDBContainer style={{ marginTop: "14vmin", paddingBottom: "10vmin" }} className="items-align-center justify-content-center " >
      <MDBCard className='text-black m-5 items-align-center shadow' style={{ borderRadius: '26px' }}>
        <MDBCardBody className='shadow'>
          <a href="/home"><BsFillArrowLeftSquareFill size='30' className='mx-3 my-3 shadow' /></a>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#001a1a" }}>Log In.</p>
              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Username' id='form2' type='email' placeholder="Username" className='shadow-sm ' onChange={e => setUserName(e.target.value)} />
              </div>
              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Password' id='form3' type='password' placeholder="Password" className='shadow-sm' onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="button" onClick={handleSubmit} className="btn btn-primary shadow mb-3 mt-3">Login</button>
              <p className='text-danger mb-5'>{formErrors}</p>
              Don't have an account? <a href='/join' className='mb-3'><strong>Sign up</strong></a>
            </MDBCol>
            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
        
      </MDBCard>
      
    </MDBContainer>
    </div>
 
    
  );
}

export default Login;