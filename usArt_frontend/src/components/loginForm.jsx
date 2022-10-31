import React from 'react';

import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
}
from 'mdb-react-ui-kit';

function Register() {
  return (
    
    <MDBContainer style={{marginTop:"14vmin", paddingBottom:"10vmin"}} className="items-align-center justify-content-center " >
      <MDBCard className='text-black m-5 items-align-center shadow' style={{borderRadius: '26px'}}>
        
        <MDBCardBody className='shadow'>
            <a href="/home"><BsFillArrowLeftSquareFill size='30' className='mx-3 my-3 shadow'/></a> 
          <MDBRow>
            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{color: "#001a1a"}}>Log In.</p>


              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Your Email' id='form2' type='email' className='shadow-sm '/> 
              </div>

              <div className="d-flex flex-row align-items-center mb-4 text-center ">
                <MDBInput label='Password' id='form3' type='password'className='shadow-sm'/>
              </div>

              <MDBBtn className='mb-5 mt-3 shadow' size='md'>Login</MDBBtn>
              Don't have an account? <a href='/join' className='mb-3'><strong>Sign up</strong></a>
            </MDBCol>

            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
            </MDBCol>
           

          </MDBRow>
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Register;