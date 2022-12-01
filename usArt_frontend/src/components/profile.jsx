import { useEffect } from 'react';
import React, { useState,useContext } from 'react';
import './profile.css';
import { useParams } from "react-router-dom";
import LINK_BACKEND from "./LINK_BACKEND"
import AuthContext from "../context/authcontext";
import { Modal } from 'bootstrap'

function Profile() {

    let { user, authTokens } = useContext(AuthContext);
    const { username } = useParams();
    let is_self = false;
    const [prof, setProfile] = useState([])

    const [buttonPopup, setButtonPopup] = useState(false)

    var input_textarea_title = document.getElementById('title');
    var input_textarea_description = document.getElementById('description');
    var input_textarea_price = document.getElementById('price');
    var input_type = document.getElementById('type');
    var input_images = document.getElementById('images');
    

    const initialValues = { state: "AR"};
    const [formValues, setFormValues] = useState(initialValues);

    

//----------------------------------------------------------------------------


    const initialImagesValues = {data: null, fullScreen: false, loading: false};
    const [stateImages, setStateImages] = useState(initialImagesValues);

    const handleFileChange = (event) => {
        const {target} = event;
        const {files} = target;
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onloadstart = () => setStateImages({loading: true});
            reader.onload = event => {
                setStateImages({
                data: event.target.result,
                loading: false
                });
            };

            reader.readAsDataURL(files[0]);
        }
    }
    
    const handleClearClick = () => {
        setStateImages({
        data: null,
        fullScreen: false
        });
    };

    const handlePreviewClick = () => {
        const {data, fullScreen} = stateImages;
        if (!data) {
        return;
        }
        setStateImages({fullScreen: !fullScreen});
    };
    
    //handleFileChange = handleFileChange.bind(this);
    //handlePreviewClick = handlePreviewClick.bind(this);
    //handleClearClick = handleClearClick.bind(this);
    
//---------------------------------------------------------------------------------
    useEffect(callApi, [])

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/userprofile/" + username)
            .then((res) => res.json())
            .then(data => {
                console.log(data)
                is_self = data.is_self;
                setProfile(data);
            }
        )
    }

    function updateOutput() {
        var title = input_textarea_title.value
        var description = input_textarea_description.value
        var price = input_textarea_price.value
        var type = input_type.value
        if (stateImages.data){
            console.log("Tiene imagen eh")
            console.log(stateImages.data)
            var images = stateImages.data
        }
        if (title.length == 0 || description.length == 0 || price.length == 0 || type == null){
            alert("Fields cannot be empty!")
        }
        else{
            console.log(title)
            postArt(title,description,price,type,images)
            alert("New article published!")
        }
    }

    function postArt(title,description,price,type,images) {
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
            'price' : price,
            'type' : type,
            'images' : [images]
          }),
        })
          .then((res) => res.json())
          .then(data => {
            console.log(data)
          }
          )
    }

    function LINK_FRONTENDContact() {
        var coModal = new Modal(document.getElementById('coModal'), {
            keyboard: false
          })
        
        coModal.show()
        
    }

    const handleChange = (e) => {
        const { type, value } = e.target;
        setFormValues({ ...formValues, [type]: value });
        console.log(value)
      };

      
    const {data, fullScreen, loading} = stateImages;
    //const backgroundImage = data ? {backgroundImage: `url(${imgData})`} : null;
    const previewClasses = ['preview', fullScreen ? 'preview--fullscreen' : ''].join(' ');


    return (

        <div>
            <section className="h-100 gradient-custom-2" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="card" style={{ width: "70vw" }}>
                    <div className=" rounded-top text-white d-flex flex-row" style={{ height: "200px", backgroundColor: "#000" }} >
                        <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                            <img src={prof.photo}
                                alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-2"
                                style={{ width: "150px", zIndex: "1" }} />

                        </div>
                        <div className="ms-3" style={{ marginTop: "130px" }}>
                            <h5>{prof.user_name}</h5>

                        </div>
                    </div>
                    <div className="p-4 text-black" style={{ backgroundColor: "#f5f5f5" }}>
                        <div className="d-flex justify-content-end text-center py-1">
                            <div className="ratings">
                                <div className="empty-stars"></div>
                                <div className="full-stars" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-4 text-black">
                        <div className="mb-5">
                            <p className="lead fw-normal mb-1">About</p>
                            <div className="p-4 rounded-top" style={{ backgroundColor: "#f5f5f5" }}>
                                <p className="font-italic mb-1">{prof.description}</p>

                            </div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center " >
                        <div className="col-lg-8">
                            <div className="card-body  p-4 text-black text-center ">
                                
                                <button onClick={LINK_FRONTENDContact} className="button" style={{ verticalAlign: "middle" }} disabled={user===null}><span>+ Create </span></button>
                                <div class="modal fade" id="coModal" tabindex="-1">
                                    <div class="modal-dialog"style={{ bottom: "0", right: "0", position: "absolute", marginRight: "35%", marginBottom: "19%" }}>
                                        <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title text-dark">Upload</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Title:<input name="title" type="text" class="content-input" id="title" required/></p>
                                            <p>Description:<textarea name="description" class="content-input" id="description" rows="4" cols="50" required ></textarea></p>
                                            <p>Price:<input name="price" type="float" class="content-input" id="price" required/></p>
                                            <p>Type:
                                            <select value={formValues.state.value} name="state" class="content-input" id="type" onChange={handleChange}>
                                                <option value="AU">AU</option>
                                                <option value="AR">AR</option>
                                                <option value="CO">CO</option>
                                            </select>
                                            </p>
                                            <p>Attach some images:</p>
                                            <div>
                                                <input
                                                id="car"
                                                type="file"
                                                accept="image/*"
                                                capture="camera"
                                                onChange={handleFileChange}
                                                />
                                                <div
                                                className={previewClasses}
                                                onClick={handlePreviewClick}
                                                >
                                                

                                                {loading &&
                                                    <span>Loading...</span>
                                                }
                                                </div>
                                                
                                                <button type='button' onClick={handleClearClick}>
                                                Clear Image
                                                </button>

                                            </div>
                                        </div>

                                        <div class="modal-footer">
                                            <button class="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Close</button>
                                            <button onClick={updateOutput} class="button" data-bs-dismiss="modal" style={{ verticalAlign: "middle", width: "100px" }}>Send </button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                        
                                        

                                <div className="mb-5 rounded-top " style={{ backgroundColor: "#f5f5f5" }}>
                                    <div className="btn-group px-4 py-3 ">
                                        <input type="radio" className="btn-check " name="options" id="radio1" autoComplete="off" />
                                        <label className="btn btn-dark" htmlFor="radio1">My products</label>
                                        <input type="radio" className="btn-check" name="options" id="radio2" autoComplete="off" />
                                        <label className="btn btn-dark" htmlFor="radio2">My services</label>
                                        <input type="radio" className="btn-check" name="options" id="radio3" autoComplete="off" />
                                        <label className="btn btn-dark" htmlFor="radio3">Purchase History</label>
                                    </div>
                                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>


                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </section>
        </div>

    );
}

export default Profile;