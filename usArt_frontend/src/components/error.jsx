import "./error.css"
function Error() {
    return (
        <section class="page_404">
            <div class="container er">
                <div class="row">
                    <div class="col-sm-12 ">
                        <div class="col-sm-10 col-sm-offset-1  text-center">
                            <div class="four_zero_four_bg">
                                <h1 style={{ color: "black" }} class="text-center ">404</h1>
                            </div>
                            <div class="contant_box_404">
                                <h3 style={{color:"black",marginLeft:"200px"}} class="h2">
                                    Look like you're lost
                                </h3>
                                <p style={{marginLeft: "200px"}}>The page you are looking for not avaible!</p>
                                <a style={{ textDecoration: "none" }} href="/home" class="link_404">Go to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>)
}

export default Error;