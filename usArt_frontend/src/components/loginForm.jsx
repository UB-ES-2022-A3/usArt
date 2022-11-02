import React from 'react';
import { useState } from 'react';
import './register.css'


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

  const [formErrors, setFormErrors] = useState();
  const [formResponse, setFormResponse] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  function loginUser(credentials) {
    let path = "http://localhost:8000/auth/log_in/" + credentials.username + "&" + credentials.password
    fetch(
      path)
      .then((res) => res.json())
      .then(data => {
        setFormResponse(data)
      }
      )
  }
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    loginUser({
      username,
      password
    });

    if (formResponse["IsLogged"] == true) {
      window.location.assign("http://localhost:3000/home")
    } else {
      setFormErrors(formResponse["respuesta"])
      console.log("erorres: ", formErrors)
    }
  };

  return (
    <MDBContainer style={{ marginTop: "14vmin", paddingBottom: "10vmin" }} className="items-align-center justify-content-center " >
      <MDBCard className='text-black m-5 items-align-center shadow' style={{ borderRadius: '26px' }}>
        <MDBCardBody className='shadow'>
          <a href="/home"><BsFillArrowLeftSquareFill size='30' className='mx-3 my-3 shadow' /></a>
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#001a1a" }}>Log In.</p>
              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Your Email' id='form2' type='email' placeholder="Email" className='shadow-sm ' onChange={e => setUserName(e.target.value)} />
              </div>
              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Password' id='form3' type='password' placeholder="Password" className='shadow-sm' onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="button" onClick={handleSubmit} className="btn btn-primary shadow mb-5 mt-3">Login</button>
              <p className='text-danger mb-2'>{formErrors}</p>
              Don't have an account? <a href='/join' className='mb-3'><strong>Sign up</strong></a>
            </MDBCol>
            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;