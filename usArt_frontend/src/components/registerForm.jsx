import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { Modal } from 'bootstrap'
import './register.css'



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



function Register() {
  let navigate = useNavigate();

  /*MODAL*/
  const [modal, setModal] = useState([]);
  const parseExceptionModal = useRef();

  useEffect(() => {
    const modal = new Modal(parseExceptionModal.current, { keyboard: false })
    setModal(modal)

  }, [])
  /*MODAL*/
  const modalChangerHome = (e) => {
    window.location.assign("http://localhost:3000/home")
  }


  const initialValues = { username: "", email: "", password: "", passwordRepeat: "" };
  let initialValue = false;
  const [formValues, setFormValues] = useState(initialValues);
  const [checkValue, setCheckValue] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

  };
  const handleCheck = (e) => {
    let valueCheck = e.target.checked;
    setCheckValue(valueCheck, checkValue)

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues, checkValue));
    setIsSubmit(true);
    console.log("erorre: ", formErrors)


  };

  useEffect(() => {

    if (Object.keys(formErrors).length === 0 && isSubmit) {
      modal.show()
    }
  }, [formErrors]);
  const validate = (values, checkValue) => {
    console.log("entro")
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    var usernameRegex = /^[a-zA-Z0-9.\$]{3,30}$/;
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\.-_!@#\$%\^&\*])(?=.{7,})");
    if (!values.username) {
      errors.username = "Username is required!";
    }else if(values.username.length < 3){
      errors.username = "Username must be 3 characters or more";
    }
    else if(!usernameRegex.test(values.username)){
      errors.username = "Username must not contain special characters";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password != values.passwordRepeat) {
      errors.password = "Password it is not the same";
    }else if (values.password.length < 7) {
      errors.password = "Password must be 8 characters or more";
    } 
    else if (!strongRegex.test(values.password)) {
      errors.password = "Password must contain an uppercase letter, a number, and a special character";
    }
    if (checkValue == false) {
      errors.check = "You need to accept terms and conditions";
    } else {

    }
    return errors;
  };

  return (
    <div>

      <MDBContainer style={{ marginTop: "14vmin", paddingBottom: "10vmin" }} className="items-align-center justify-content-center " >




        <MDBCard className='text-black m-5 items-align-center shadow' style={{ borderRadius: '25px' }}>


          <MDBCardBody className='shadow'>
            <a href="/home"><BsFillArrowLeftSquareFill size='30' className='mx-3 my-3 shadow' /></a>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#001a1a" }}>Sign up.</p>

                <form className="w-50 text-center align-items-center" onSubmit={handleSubmit}>

                  <div className="">

                    <MDBInput label='Username' name="username" id='form1' type='text' placeholder="Username" className='w-100 shadow-sm ' value={formValues.username} onChange={handleChange} />

                  </div>

                  <p className='text-danger mb-3'>{formErrors.username}</p>

                  <div className="">
                    <MDBInput label='Your Email' id='form2' name="email" type='email' className='shadow-sm' placeholder="Email" value={formValues.email} onChange={handleChange} />
                  </div>
                  <p className='text-danger mb-3'>{formErrors.email}</p>

                  <div className="">
                    <MDBInput label='Password' id='form3' type='password' name="password" placeholder="Password" className='shadow-sm' value={formValues.password} onChange={handleChange} />
                  </div>
                  <p className='text-danger mb-3'>{formErrors.password}</p>

                  <div className=" ">
                    <MDBInput label='Repeat your password' id='form4' type='password' name="passwordRepeat" placeholder="Password" className='shadow-sm' value={formValues.passwordRepeat} onChange={handleChange} />
                  </div>
                  <p className='text-danger mb-3'>{formErrors.password}</p>

                  <div className="form-check  text-center align-items-center justify-content-center">
                    <input className="form-check-input d-inline-block px-1 " name="checkboxTerms" type="checkbox" id="flexCheckDefault" value={formValues.checkboxTerms} onChange={handleCheck} />
                    <label className="form-check-label px-3 " for="flexCheckDefault" >
                      I agree to <a href='https://www.termsofusegenerator.net/'>Terms of Use</a> and <a href='https://www.termsofusegenerator.net/'>Privacy Policy </a>of UsArt
                    </label>
                  </div>
                  <p className='text-danger'>{formErrors.check}</p>

                  <div className="form-check  text-center align-items-center justify-content-center py-3">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2"/>
                      <label className="form-check-label px-3 " for="flexCheckDefault2">
                       I agree recieving emails about usArt services
                      </label>
                  </div>
                  

                  <button type="button" onClick={handleSubmit} className="btn btn-primary shadow mb-5 mt-3">Register</button>

                  <div className="modal fade" tabIndex="-1" ref={parseExceptionModal} onChange={modalChangerHome}>
                    <div className="modal-dialog">
                      <div className="modal-content" >
                        <div className="modal-header">
                          <h5 className="modal-title">Success</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <p>User was correctly created.</p>
                        </div>
                        <div className="modal-footer">
                          <button onClick={modalChangerHome} hidden={modalChangerHome} type="button" className="btn btn-outline-secondary">
                            Great !
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>


                Already have an account? <a href='/login' className='mb-3'><strong>Log in</strong></a>

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

export default Register;