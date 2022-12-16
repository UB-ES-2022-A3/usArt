import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import './profile.css';
import { useParams } from "react-router-dom";
import LINK_BACKEND from "./LINK_BACKEND"
import AuthContext from "../context/authcontext";
import Footer from './footer'
import empty from '../assets/suchEmpty.png'
import LINK_FRONTEND from './LINK_FRONTEND';
import { Modal } from 'bootstrap'

function Profile() {

    const { username, edit } = useParams();
    let { user, authTokens } = useContext(AuthContext);
    let [prof, setProfile] = useState([])
    const [products, setProducts] = useState([])
    const [historialProducts, setHistorialProducts] = useState([])
    const [reviews, setReviews] = useState([])
    const [stars, setStars] = useState(0)
    const [review, setReview] = useState(0)
    const [message, setMessage] = useState('');
    const [components, setComponents] = useState([]);
    const [radioGender, setRadioProduct] = useState('Products');
    const [buttonPopup, setButtonPopup] = useState(false)
    const [block, setBlock] = useState('')
    const [serverError, setServerError] = useState()
    var input_textarea_title = document.getElementById('titlepost');
    var input_textarea_description = document.getElementById('descriptionpost');
    var input_textarea_price = document.getElementById('pricepost');
    var input_type = document.getElementById('typepost');


    const initialValues = { state: "AR" };
    const [formValues, setFormValues] = useState(initialValues);

    const [pictureUpdate, setPictureUpdate] = useState()


    //----------------------------------------------------------------------------

    const [stateImages, setStateImages] = useState([]);
    const [warning, setWarning] = useState(false)
    const [warning2, setWarning2] = useState(false)
    const handleFileChange = (event) => {
        const { target } = event;
        const { files } = target;
        let fileExtension = files[0].name.replace(/^.*\./, '');
        let imagesExtension = ["png", "jpg", "jpeg"];
        if (imagesExtension.indexOf(fileExtension) === -1) {
            setWarning(true)
            let modalImage = new Modal(document.getElementById('needImage'), {
                keyboard: false, backdrop: "static"
            })
            setServerError("Try to upload a photo... ")
            modalImage.show()

            return
        }

        if (files && files[0]) {
            var reader = new FileReader();
            reader.onloadstart = () => setStateImages([{ loading: true }]);
            reader.onload = event => {
                if (window.location.href.includes('edit')) {
                    setPictureUpdate({
                        data: event.target.result,
                        loading: false,
                        target: URL.createObjectURL(files[0])

                    })
                    document.getElementById("profilePhoto").src = URL.createObjectURL(files[0]);
                } else {
                    setStateImages([...stateImages, {
                        data: event.target.result,
                        loading: false,
                        target: URL.createObjectURL(files[0])
                    }])
                }
            };
        };

        reader.readAsDataURL(files[0]);
    }




    const handlePreviewClick = () => {
        const { data, fullScreen } = stateImages;
        if (!data) {
            return;
        }
        setStateImages({ fullScreen: !fullScreen });
    };

    //handleFileChange = handleFileChange.bind(this);
    //handlePreviewClick = handlePreviewClick.bind(this);
    //handleClearClick = handleClearClick.bind(this);

    //---------------------------------------------------------------------------------
    const handleChangeRadio = (event) => {
        setRadioProduct(event.target.value)
    }
    useEffect(callApi, [])
    useEffect(callApiProducts, [])
    useEffect(callApiHistorialProducts, [])
    useEffect(callApiReviews, [])

    //---------------------------------------------------------------------------------

    function callApi() {
        if (user !== null) {
            fetch(
                LINK_BACKEND + "/api/userprofile/" + username, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                }
            })
                .then((res) => res.json())
                .then(data => {
                    setProfile(data);
                    fetch(LINK_BACKEND + "/api/userprofile/blocker/" + data.id, {
                        method: 'GET',
                        withCredentials: true,
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + authTokens.access,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(data => {
                            

                            if (!data.ok) {

                                setBlock("Block")

                            } else {

                                setBlock("Unblock")
                            }
                        })

                }
                )

        } else {
            fetch(
                LINK_BACKEND + "/api/userprofile/" + username)
                .then((res) => res.json())
                .then(data => {

                    setProfile(data);

                }

                )
        }
        takeReview()
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

    function callApiHistorialProducts() {
        if (user == null) return
        fetch(
            LINK_BACKEND + "/api/userprofile/purchases/", {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
            }
        })
            .then((res) => res.json())
            .then(data => {
                setHistorialProducts(data);
            }
            )
    }

    function callApiReviews() {
        fetch(
            LINK_BACKEND + "/api/userprofile/review-list/" + username)
            .then((res) => res.json())
            .then(data => {
                setReviews(data);
            }
            )
    }

    function renderBanIfAdmin() {
        
        if (user == null) return
        if (!user.is_superuser || user.username == username) return
        if (prof.status == "BAN") {
            return (
                <div>
                    <button type="button" class="btn btn-warning" onClick={(e) => banUser(e, false)}>Unban user</button>
                </div>
            )
        } else if (prof.status == "ALO") {
            return (
                <div>
                    <button type="button" class="btn btn-danger" onClick={showBanModal}>Ban user</button>
                </div>
            )
        }
    }

    function showBanModal() {
        document.getElementById("profileOpacity").style.opacity = "0.5"
        var banModal = new Modal(document.getElementById('banModal'), {
            keyboard: false,
            backdrop: "static"
        })
        setModal(banModal)
        banModal.show()
    }

    function banUser(e, ban) {
        e.preventDefault();
        let banUser = "ALO"
        if (ban) {
            banUser = "BAN"
        }
        fetch(LINK_BACKEND + "/api/userprofile/ban-user/" + username, {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user_name': username,
                'status': banUser,
            }),
        })
            .then((res) => res.json())
            .then(data => {
                const profile = { ...prof, status: data.status }
                setProfile(profile)
                document.getElementById("profileOpacity").style.opacity = "1"
                modal.hide()
            })
    }

    function renderIfRadio() {

        if (radioGender === 'Products') {
            if (products.length !== 0) {
                return products.map(RenderMyProducts)
            } else {
                return RenderEmpty()
            }
        } else if (radioGender === 'Reviews') {
            if (reviews.length !== 0) {
                return reviews.map(RenderReviews)
            } else {
                return RenderEmpty()
            }
        } else {

            if (historialProducts.length === 0) {
                return RenderEmpty()
            } else {
                return historialProducts.map(RenderMyHistorialProducts)
            }
        }
    }
    function RenderEmpty() {
        return (
            <div>
                <img src={empty} className="" alt="Noel" ></img>
                <p className='py-3' style={{ color: "gray" }}>Wow, such empty</p>
            </div>
        )
    }

    function RenderPurchaseHistory() {
        
        if (prof.length == 0){
            return (<div className="btn-group px-4 py-5 ">
                <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio1">Products</label>
                <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio2">Reviews</label>
            </div>)
        }
        let possesive = prof.user_name.charAt(prof.user_name.length - 1) === 's' ? prof.user_name + '\'' : prof.user_name + '\'s'
        if (prof.is_self) {
            return (<div className="btn-group px-4 py-5 ">
                <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio1">{possesive} Products</label>
                <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio2">{possesive} Reviews</label>
                <input type="radio" className="btn-check" name="options" id="radio3" autoComplete="off" value="Purchase" checked={radioGender === 'Purchase'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio3">Purchase History</label>
            </div>)
        } else {
            return (<div className="btn-group px-4 py-5 ">
                <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" value="Products" checked={radioGender === 'Products'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio1">{possesive} Products</label>
                <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" value="Reviews" checked={radioGender === 'Reviews'} onChange={handleChangeRadio} />
                <label className="btn btn-outline-dark" htmlFor="radio2">{possesive} Reviews</label>
            </div>)
        }
    }
    function updateOutput() {
        var title = input_textarea_title.value
        var description = input_textarea_description.value
        var price = input_textarea_price.value
        var type = input_type.value
        let images = []
        if (stateImages.length > 0) {
            stateImages.forEach(element => {
                images.push(element.data)
            });
        } else {
            setWarning2(true)
            return

        }
        if (title.length === 0 || description.length === 0 || price.length === 0 || type == null) {
            setWarning2(true)
        }
        else {
            setWarning2(false)
            postArt(title, description, price, type, images)

        }
    }
    const [modal, setModal] = useState()
    function postArt(title, description, price, type, images) {



        fetch(LINK_BACKEND + "/api/catalog/manage/post/", {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'title': title,
                'description': description,
                'price': price,
                'type': type,
                'images': images
            }),
        })
            .then((res) => {
                if (res.status !== 201) {
                    let modalImage = new Modal(document.getElementById('needImage'), {
                        keyboard: false, backdrop: "static"
                    })
                    modalImage.show()
                    setServerError("Error uploading")
                }
                return res.json()
            })
            .then(data => {
                callApiProducts()
                modal.hide()

            }
            )
        document.getElementById("profileOpacity").style.opacity = "1";
    }

    function LINK_FRONTENDContact() {
        document.getElementById("profileOpacity").style.opacity = "0.5"
        var coModal = new Modal(document.getElementById('coModal'), {
            keyboard: false,
            backdrop: "static"
        })
        setModal(coModal)
        coModal.show()

    }
    async function LINK_FRONTENDBloc() {
        document.getElementById("profileOpacity").style.opacity = "0.5"
        var modalfade = new Modal(document.getElementById('blockmodal'), {
            keyboard: false
        })
        const response = await fetch(
            LINK_BACKEND + "/api/userprofile/blocker/" + prof.id, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
        })
        if (!response.ok) {

            modalfade.show()


        } else {
            PutBlock()
            setBlock("Block")
        }

    }

    const handleChangePosting = (e) => {
        const { type, value } = e.target;
        setFormValues({ ...formValues, [type]: value });
    };

    function loadUploadButton() {

        if (user == null) return
        if (user.username === username)
            return (<button onClick={LINK_FRONTENDContact} className="button" style={{ width: "150px", verticalAlign: "middle", marginTop: "-10px", marginBottom: "5%" }} disabled={user === null | window.location.href.includes('edit')}><span>Upload Art</span></button>)
    }

    const { data, fullScreen, loading } = stateImages;
    //const backgroundImage = data ? {backgroundImage: `url(${imgData})`} : null;
    const previewClasses = ['preview', fullScreen ? 'preview--fullscreen' : ''].join(' ');


    //#TODO, En teoria habrá una fecha
    function RenderMyHistorialProducts(product) {
        return (
            <a style={{ margin: "1%", textDecoration: 'none' }} href={"/purchasedetails/" + product.id} key={product.id}>
                <div className='d-flex rounded  p-3 productRow text-center align-items-center justify-content-center' style={{ backgroundColor: "white" }}>
                    <img src={product.pub_id.images[0]} className="imageProducts shadow rounded" alt="Sorry! not available at this time" ></img>
                    <div className='col-3  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}><strong>{product.price}€</strong></h1>
                    </div>
                    <div className='col-4  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}>{product.pub_id.description}</h1>
                    </div>
                    <div className='col-2  d-flex  justify-content-center'>
                        <h1 style={{ color: "black", fontSize: "1em" }}>{product.date}</h1>
                    </div>
                </div>
            </a>
        )
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

    function RenderReviews(review) {
        return (
            <a style={{ margin: "1%", textDecoration: 'none' }}>
                <div className='d-flex rounded  p-3 productRow text-center align-items-center justify-content-center' style={{ backgroundColor: "white" }}>
                    <img src={review.reviewer_id.photo} className="imageUsers shadow rounded col-2" alt="Sorry! not available at this time" ></img>
                    <div className='reviewContainer col-10  d-flex  justify-content-center'>
                        <div className='grid' style={{ justifyContent: 'center' }}>
                            <div className='row-2'>
                                <h3 style={{ color: "black" }}>
                                    <strong>{review.reviewer_id.user_name}</strong>
                                </h3>
                                <div className="ratings">
                                    <div className="empty-stars"></div>
                                    <div className="full-stars" style={{ width: review.stars / 5 * 100 + "%" }} ></div>
                                </div>
                            </div>
                            <div className='row-8 review-row'>
                                <p style={{ color: "black", fontSize: "1em" }}>{review.review}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }
    const handleMessageChange = event => {
        // 👇️ access textarea value
        setMessage(event.target.value);
    };
    function takeReview() {
        fetch(
            LINK_BACKEND + "/api/userprofile/review-artist/" + username)
            .then((res) => res.json())
            .then(data => {
                setReview(data.average / 5 * 100 + "%");
            }
            )
    }
    function sendReview() {
        if (message.length === 0 | stars === 0) {
            document.getElementById("textDes").placeholder = "You must write something and give stars! ";
            return
        }

        fetch(
            LINK_BACKEND + "/api/userprofile/review-artist/", {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'reviewed_id': prof.id,
                'stars': stars,
                'review': message
            })
        }).then((res) => res.json())
            .then(data => {
                callApiReviews()
                takeReview()
            }
            )

        document.getElementById("profileOpacity").style.opacity = "1";
    }



    function handleEditClick() {
        const link = LINK_FRONTEND + "/profile/" + username + "/edit";
        window.location.assign(link)

    }



    function save() {
        const selectedFile = document.getElementById('file-input').files[0];
        const re = new RegExp('image\/(.+)');
        if (selectedFile == undefined) {

            let des = document.getElementById("description");
            let description = des.textContent;
            fetch(LINK_BACKEND + "/api/userprofile/update/", {
                method: 'PUT',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'description': description
                }),
            })
                .then((res) => {
                    if (res.status === 500) {
                        let modalImage = new Modal(document.getElementById('needImage'), {
                            keyboard: false, backdrop: "static"
                        })
                        modalImage.show()
                        setServerError("Load again the image")
                    } else {
                        const link = LINK_FRONTEND + "/profile/" + username + "/default";
                        window.location.assign(link)
                    }
                    return res.json()
                })
                .then(data => {

                }
                )
        }
        else {
            if (!re.test(selectedFile.type)) {

                return
            }
            let des = document.getElementById("description");
            let description = des.textContent;
            fetch(LINK_BACKEND + "/api/userprofile/update/", {
                method: 'PUT',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'description': description,
                    'photo': pictureUpdate.data
                }),
            })
                .then((res) => {
                    if (res.status === 500) {
                        let modalImage = new Modal(document.getElementById('needImage'), {
                            keyboard: false, backdrop: "static"
                        })
                        modalImage.show()
                        setServerError("Load again the image")
                    } else {
                        const link = LINK_FRONTEND + "/profile/" + username + "/default";
                        window.location.assign(link)
                    }
                    return res.json()
                })
                .then(data => {

                }
                )
        }



    }

    function is_other() {
        if (user == null) return
        if (username !== user.username) {

            return <button style={{ borderRadius: "0.375rem" }} type="button" data-bs-toggle="modal" onClick={() => document.getElementById("profileOpacity").style.opacity = "0.5"} data-bs-target="#staticBackdrop" class="btn btn-dark">Rate me!</button>
        }
    }
    function is_blockbutton() {
        if (user == null) return
        if (username !== user.username) {

            return <button style={{ borderRadius: "0.375rem" }} type="button" data-bs-toggle="modal-fade" id="block button" onClick={LINK_FRONTENDBloc} data-bs-target="#blockmodal" class="btn btn-dark"><span>{block} </span></button>
        }
    }



    function buttonsTogether() {


        if (user == null) return
        if (username === user.username) {
            if (edit !== "edit") {
                return <button onClick={handleEditClick} id="editButton" style={{ width: "150px", borderRadius: "0.375em" }} type="button" class="btn btn-outline-dark">
                    Edit profile
                </button>
            }

            return ([<button onClick={save} id="saveBtn" style={{ width: "150px", borderRadius: "0.375em" }} type="button" class="btn btn-outline-dark">
                Save
            </button>, <div style={{ marginLeft: "5px", border: "black" }} class="file-input">
                <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    class="file-input__input"
                    accept="image/*"
                    capture="camera"
                    onChange={handleFileChange}
                />
                <label class="file-input__label" for="file-input">
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="upload"
                        accept="image/*"
                        class="svg-inline--fa fa-upload fa-w-16"
                        role="img"
                        capture="camera"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"

                    >
                        <path
                            fill="currentColor"
                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                        ></path>
                    </svg>
                    <span>Upload new picture </span></label>
            </div>])
        }
    }
    function generateAbout() {
        if (user == null | username == null) {
            return (
                <div className="card-body p-4 text-black">
                    <div className="mb-1">
                        <p className="lead fw-normal mb-1">About</p>
                        <div id="borderDes" className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5" }}>
                            <p id="description" style={{ outline: "0px solid transparent" }} contentEditable={false} className="font-italic mb-1">{prof.description}</p>

                        </div>
                    </div>
                </div>)
        }
        else if (username === user.username) {
            if (edit === "edit") {
                return (
                    <div className="card-body p-4 text-black">
                        <div className="mb-1">
                            <p className="lead fw-normal mb-1">About</p>
                            <div id="borderDes" className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5", border: "solid", borderRadius: "0.375rem" }}>
                                <p id="description" style={{ outline: "0px solid transparent" }} contentEditable={true} className="font-italic mb-1">{prof.description}</p>

                            </div>
                        </div>
                    </div>)
            } else {
                return (
                    <div className="card-body p-4 text-black">
                        <div className="mb-1">
                            <p className="lead fw-normal mb-1">About</p>
                            <div id="borderDes" className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5" }}>
                                <p id="description" className="font-italic mb-1">{prof.description}</p>

                            </div>
                        </div>
                    </div>)


            }
        } else {
            return (
                <div className="card-body p-4 text-black">
                    <div className="mb-1">
                        <p className="lead fw-normal mb-1">About</p>
                        <div id="borderDes" className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5" }}>
                            <p id="description" style={{ outline: "0px solid transparent" }} contentEditable={false} className="font-italic mb-1">{prof.description}</p>

                        </div>
                    </div>
                </div>)
        }
    }
    function checkNumbers(e) {

        if (input_textarea_price.value > 6) {
            if (input_textarea_price.value[5] === ".") input_textarea_price.value = input_textarea_price.value.slice(0, 4);
            else { input_textarea_price.value = input_textarea_price.value.slice(0, 6); }
        }
    }
    const handleClearClick = (e) => {
        let fileReader = stateImages.filter(function (value, index, arr) {
            return value.target !== e.src & e.accessKey !== index;
        });
        
        setStateImages(fileReader)

    };
    function showImages(images, key) {

        if (stateImages.length === 0) return
        return (
            <div class="image-div">
                <img key={key} id={"image" + key} accessKey={key} style={{ margin: "5px", borderRadius: "20px" }} src={images.target} className="size-img stack-images" alt="Img selected"></img>
                <div onClick={() => handleClearClick(document.getElementById("image" + key))} class="trashContainer hidden_img">
                    <div class="trash">
                        <div class="tap">
                            <div class="tip"></div>
                            <div class="top"></div>
                        </div>
                        <div class="tap2">
                            <div class="bottom">
                                <div class="line"></div>
                                <div class="line"></div>
                                <div class="line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    function showWarning(images, key) {

        if (warning) return <div><p style={{ color: "red" }}>Warning! We only accept :  "png", "jpg", "jpeg";</p></div>

    }
    function showConditions() {

        if (warning2) return <div><p style={{ color: "red" }}>Fill all the fields please</p></div>

    }
    function PutBlock() {

        fetch(LINK_BACKEND + "/api/userprofile/bloc/" + prof.id, {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then(data => { })

        


        if (block == "Block") {
            setBlock("Unblock")
        }

        document.getElementById("profileOpacity").style.opacity = "1"


        return
    }

    return (
        <div>
            <div id='profileOpacity'>
                <section className="h-100 gradient-custom-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="card" style={{ width: "70vw" }}>
                        <div className=" rounded-top text-white d-flex flex-row" style={{ height: "200px", backgroundColor: "#000" }} >
                            <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                                <img src={prof.photo} id="profilePhoto"
                                    alt="Profile" className="img-fluid img-thumbnail mt-4 mb-2"
                                    style={{ minWidth: "150px", minHeight: "150px", maxWidth: "150px", maxHeight: "150px", zIndex: "1" }} />
                            </div>
                            <div className="ms-3" style={{ marginTop: "130px" }}>
                                <h5>{prof.user_name}</h5>
                            </div>
                        </div>
                        <div className="p-4 text-black" style={{ backgroundColor: "#f5f5f5" }}>
                            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group" role="group" aria-label="First group" >
                                    {buttonsTogether()}

                                </div>
                                <div class="input-group" id='input-group' >
                                    {is_blockbutton()}
                                    <div style={{ marginLeft: "30px" }} className="ratings">

                                    </div>
                                    {is_other()}
                                    <div style={{ marginLeft: "25px" }} className="ratings">
                                        <div className="empty-stars"></div>
                                        <div className="full-stars" style={{ width: review }} ></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {generateAbout()}
                        <div className="row d-flex justify-content-center " >
                            <div className="col-lg-8">
                                <div className="card-body  p-4 text-black text-center ">
                                    {loadUploadButton()}
                                    <div className="mb-5 rounded-top " style={{ backgroundColor: "#f5f5f5" }}>
                                        {RenderPurchaseHistory()}
                                        <div className="p-4" style={{ backgroundColor: "#f5f5f5" }}>
                                            {renderIfRadio()}
                                        </div>
                                    </div>
                                    {renderBanIfAdmin()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="modal fade" id="blockmodal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-dark" id="modal_title">Are you sure you want to block this user?</h4>
                        </div>
                        <div className="modal-footer">
                            <button className="button" id="close_button" onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} data-bs-dismiss="modal" style={{ marginRight: "5%", verticalAlign: "middle", width: "100px" }}>Cancel</button>
                            <button onClick={PutBlock} id="send_button" className="button" data-bs-dismiss="modal" style={{ marginRight: "5%", verticalAlign: "middle", width: "100px" }}>Block</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content custom-modal">
                        <div className="modal-header custom-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Review {username}! :)</h5>
                            <div class="star-rating">
                                <input type="radio" name="stars" id="star-a" value="5" />
                                <label for="star-a" onClick={() => setStars(5)}></label>

                                <input type="radio" name="stars" id="star-b" value="4" />
                                <label for="star-b" onClick={() => setStars(4)}></label>

                                <input type="radio" name="stars" id="star-c" value="3" />
                                <label for="star-c" onClick={() => setStars(3)}></label>

                                <input type="radio" name="stars" id="star-d" value="2" />
                                <label for="star-d" onClick={() => setStars(2)}></label>

                                <input type="radio" name="stars" id="star-e" value="1" />
                                <label for="star-e" onClick={() => setStars(1)}></label>
                            </div>

                            <button style={{ backgroundColor: "white" }} type="button" onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body custom-body-modal ">
                            <div class="search-container">

                                <textarea id='textDes' maxLength="300" type="text" onChange={handleMessageChange} placeholder="try: you are awesome with the brush" />
                            </div>
                        </div>
                        <div className='modal-footer custom-footer'>
                            <button id="search-btn" onClick={sendReview} disabled={stars === 0 | message.length === 0} data-bs-dismiss="modal" aria-label="Close" className='btn2'>Rate</button>
                        </div>
                    </div>

                </div>

            </div>


            <div className="modal" id="coModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content upload-modal">
                        <div class="modal-header" style={{ marginTop: "-5%" }} >
                            <h5 class="modal-title text-dark">Upload</h5>
                            <button onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div >
                                <p>Title:</p>
                                <input style={{ marginBottom: "2%" }} name="title" type="text" class="content-input-title" id="titlepost" required />
                            </div>
                            <div>
                                <p>Description:</p>
                                <textarea name="description" class="content-input" id="descriptionpost" rows="4" cols="50" required ></textarea>
                            </div>
                            <div>
                                <p>Price:</p>
                                <p><input name="price" type="number" onInput={checkNumbers} id='pricepost'  ></input> €</p>
                            </div>
                            <div style={{ marginTop: "4%", display: "flex", flexDirection: "column" }}>
                                <p>Type:
                                    <select style={{ marginLeft: "2%" }} value={formValues.state.value} name="state" class="content-input" id="typepost" onChange={handleChangePosting}>
                                        <option value="AR">Art</option>
                                        <option value="CO">Commission</option>
                                        <option value="AU">Auction</option>
                                    </select>
                                </p>
                            </div>
                            {showConditions()}
                            <p>Attach some images:</p>
                            {showWarning()}
                            <div style={{ display: "flex" }}>
                                <input
                                    type="file"
                                    name="file-input"
                                    id="file-input"
                                    class="file-input__input"
                                    accept="image/*"
                                    capture="camera"
                                    onChange={handleFileChange}
                                />
                                <label class="file-input__label" for="file-input" style={{ padding: "0", marginRight: "2%" }}>
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="upload"
                                        accept="image/*"
                                        class="svg-inline--fa fa-upload fa-w-16"
                                        role="img"
                                        capture="camera"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                        ></path>
                                    </svg>
                                    <div
                                        className={previewClasses}
                                        onClick={handlePreviewClick}
                                    >

                                        {loading &&
                                            <span>Loading...</span>
                                        }
                                    </div>
                                    <span>Upload new picture </span></label>
                            </div>
                            <div className='row'>
                                <div className="col-sm" style={{ margin: "1%" }}>
                                    {stateImages.map(showImages)}
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer" style={{ marginBottom: "-8%" }}>
                            <button onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} class="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Close</button>
                            <button onClick={updateOutput} class="button" id='sendButton' style={{ verticalAlign: "middle", width: "100px" }}>Send </button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="modal fade" id="banModal" tabIndex="-1" aria-labelledby="banModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-dark" id="banModalLabel">Do you want to ban this user?</h5>
                        </div>
                        <div class="modal-body">
                            <textarea style={{ resize: "none" }} class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button onClick={() => document.getElementById("profileOpacity").style.opacity = "1"} type="button" class="btn btn-dark" data-bs-dismiss="modal">No</button>
                            <button type="button" class="btn btn-danger" onClick={(e) => banUser(e, true)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="needImage" tabIndex="-1">
                <div className="modal-dialog" style={{ textAlign: "center" }}>
                    <div className="modal-content">
                        <div className="modal-header" style={{ width: "justifyContent" }}>
                            <h4 className="modal-title text-dark" id="modal_title">{serverError}</h4>
                        </div>
                        <div className="modal-footer" style={{}} >
                            <button onClick={() => { document.getElementById("toOpacity").style.opacity = "1" }} id="send_button" className="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Okay</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div >

    );
}
export default Profile;