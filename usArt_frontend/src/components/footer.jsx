import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="text-center text-white" style={{ backgroundColor: "#263636" }}>
                <div className="container">
                    <section className="mt-5">
                        <div className="row text-center d-flex justify-content-center pt-5">

                            <div className="col-md-2">
                                <h6 className="text-uppercase font-weight-bold">
                                    <p className="text-white">About us</p>
                                </h6>
                            </div>

                            <div className="col-md-2">
                                <h6 className="text-uppercase font-weight-bold">
                                    <p href="#!" className="text-white">Products</p>
                                </h6>
                            </div>



                            <div className="col-md-2">
                                <h6 className="text-uppercase font-weight-bold">
                                    <p href="#!" className="text-white">Terms And Services</p>
                                </h6>
                            </div>



                            <div className="col-md-2">
                                <h6 className="text-uppercase font-weight-bold">
                                    <p href="#!" className="text-white">Help</p>
                                </h6>
                            </div>



                            <div className="col-md-2">
                                <h6 className="text-uppercase font-weight-bold">
                                    <p href="#!" className="text-white">Contact</p>
                                </h6>
                            </div>

                        </div>

                    </section>


                    <hr className="my-5" />


                    <section className="mb-2">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <p style={{color: "white"}}>
                                    Privacy is important for us, from the usArt team we recommend reading our terms and services,
                                    if you have any inquirie contact us at: 
                                    <br />
                                    <br />
                                    <strong> inquiries@usart.com</strong>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="text-center mb-2">
                        <a href="" className="text-white me-4">

                        </a>
                        <a href="" className="text-white me-4">

                        </a>
                        <a href="" className="text-white me-4">

                        </a>
                        <a href="" className="text-white me-4">

                        </a>
                        <a href="" className="text-white me-4">

                        </a>
                        <a href="" className="text-white me-4">

                        </a>
                    </section>

                </div>
                <div
                    className="text-center p-3"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                >
                    © 2022 Copyright:
                    <a className="text-white" href="http://localhost:3000/home"> UsArt</a>
                </div>

            </footer>

        </div>



    )
} export default Footer;
