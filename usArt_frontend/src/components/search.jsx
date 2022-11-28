import React, { useState } from 'react';
import { useEffect } from 'react';
import { BsSearch, BsBrushFill, BsFillPersonFill } from "react-icons/bs";
import { AiFillWechat } from "react-icons/ai";
import { useParams } from "react-router-dom"
import LINK_BACKEND from "./LINK_BACKEND"
import LINK_FRONTEND from "./LINK_FRONTEND"
import "./search.css"
import Footer from './footer';

function Search() {
    const { search, id } = useParams()
    const [cards, setCards] = useState([]);
    const [content, setContent] = useState();
    const [option, setOption] = useState(0)

    function goSearch() {
        if (content === undefined) return
        console.log(option)
        const link = LINK_FRONTEND + "/search/" + content + "/" + option;
        window.location.assign(link)
    }
    useEffect(callApi, [])


    function callApi() {
        let link = ""

        if (id === "2") {
            link = LINK_BACKEND + "/api/userprofile/users/?search=" + search
        } else {
            link = LINK_BACKEND + "/api/catalog/?search=" + search
        }

        setOption(id)
        fetch(
            link)
            .then((res) => res.json())
            .then(data => {
                setCards(data);
                if (cards.length === 0) {
                    return (
                        <div className='center'>
                            <div class="loader">
                                <div className="loader-wheel"></div>
                                <div className="loader-text"></div>
                            </div>
                        </div>)
                }
            }
            )
    }
    

    function RenderCard(card, index) {
        if (id === "2") {
            return (
                <a style={{ margin: "1%", textDecoration: 'none' }} href={"/profile/" + card.user_name} key={card.id}>
                    <div className="card custom search-card">
                        <picture >
                            <img style={{ marginTop: "10px" }} id={index} src={card.photo} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
                        </picture>
                        <div className="card-body ">
                            <div className='grid' style={{justifyContent:"inherit"}}>
                                <h5 style={{ color: "black" }}><strong>{card.user_name}</strong></h5>
                                <div className="ratings" style={{marginTop:"-5px"}}>
                                    <div className="empty-stars"></div>
                                    <div className="full-stars" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                            <p className="card-text max">{card.description}</p>
                        </div>

                    </div>
                </a>
            )
        }

        return (
            <a style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + card.id} key={card.id}>
                <div className="card custom search-card">
                    <picture >
                        <img id={index} src={LINK_BACKEND + card.images[0]} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
                    </picture>
                    <div className="card-body ">
                        <h5 style={{ color: "black" }}><strong>{card.price}€</strong></h5>
                        <h5 style={{ color: "black" }} className="card-title max-text"><strong>{card.title}</strong></h5>
                        <p className="card-text max-text"><small>{card.author.user_name}</small>  </p>
                        <p className="card-text max">{card.description}</p>
                    </div>

                </div>
            </a>
        )
    }
    function selectComision() {
        if (document.getElementById("box2").classList.contains("active")) {
            document.getElementById("box2").classList.toggle("active")
        }
        if (document.getElementById("box3").classList.contains("active")) {
            document.getElementById("box3").classList.toggle("active")
        }
        if (document.getElementById("box1").classList.contains("active")) {
            return
        }
        document.getElementById("box1").classList.toggle("active")
        setOption(0)

    }
    function selectArt() {
        if (document.getElementById("box1").classList.contains("active")) {
            document.getElementById("box1").classList.toggle("active")
        }
        if (document.getElementById("box3").classList.contains("active")) {
            document.getElementById("box3").classList.toggle("active")
        }
        if (document.getElementById("box2").classList.contains("active")) {
            return
        }
        document.getElementById("box2").classList.toggle("active")
        setOption(1)


    }
    function selectUsers() {
        if (document.getElementById("box1").classList.contains("active")) {
            document.getElementById("box1").classList.toggle("active")
        }
        if (document.getElementById("box2").classList.contains("active")) {
            document.getElementById("box2").classList.toggle("active")
        }
        if (document.getElementById("box3").classList.contains("active")) {
            return
        }
        document.getElementById("box3").classList.toggle("active")
        setOption(2)
    }


    return (
        <div>
            <div style={{ minHeight: "88vh", backgroundColor: "white", marginInlineStart: "5%", marginInlineEnd: "5%", borderRadius: "20px", marginBlockEnd: "1%" }}>
                <div style={{ paddingTop: "5%" }}>
                    <div className="header-container ">
                        <h1 style={{ color: "black" }}>Resultados de {search}..</h1>
                        <p >{cards.length} resultado/s encontrado/s</p>
                    </div>
                    <div className="input-group custom-input">
                        <input onChange={e => setContent(e.target.value)} type="search" placeholder="Try: Dragon ball drawings" aria-describedby="button-addon1" className="form-control border-0 bg-light" />
                        <div className="input-group-append">
                            <button onClick={goSearch} id="button-addon1" type="submit" className="btn btn-link text-primary"><BsSearch /></button>
                        </div>
                    </div>
                    <div className='grid search-grid'>
                        <div className="box1" id="box1" onClick={selectComision}>
                            <p >Comisiones </p>
                            <AiFillWechat className="icons" size='sm' />
                        </div>
                        <div className="box2" id="box2" onClick={selectArt}>
                            <p style={{ textAlign: "center" }}>Arte </p>
                            <BsBrushFill className="icons" size='sm' />
                        </div>
                        <div className="box3" id="box3" onClick={selectUsers}>
                            <p style={{ textAlign: "center" }}>Usuarios </p>
                            <BsFillPersonFill className="icons" size='sm' />
                        </div>
                    </div>

                    <div className="grid custom-grid">
                        {cards.map(RenderCard)}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>)

}
export default Search;