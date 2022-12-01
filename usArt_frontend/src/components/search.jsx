import React, { useState } from 'react';
import { useEffect } from 'react';
import { BsSearch, BsBrushFill, BsFillPersonFill, BsXLg } from "react-icons/bs";
import { AiFillWechat } from "react-icons/ai";
import { useParams } from "react-router-dom"
import LINK_BACKEND from "./LINK_BACKEND"
import LINK_FRONTEND from "./LINK_FRONTEND"
import "./search.css"
import Footer from './footer';

function Search() {
    const { search } = useParams()
    const [cards, setCards] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [allCards, setAllCards] = useState([])
    const [content, setContent] = useState(search);
    const [component, setComponents] = useState([]);
    const [option, setOption] = useState("")


    function goSearch() {
        if (content === undefined) return

        const link = LINK_FRONTEND + "/search/" + content;
        window.location.assign(link)
    }
    const enterEvent = (event) => {
        if (event.keyCode === 13) {
            goSearch()
        }
    }
    useEffect(callApi, [])
    useEffect(filter, [option])

    function filter() {

        if (option === "All") {
            setCards(allCards)
            return
        }
        if (allCards.length === 0 || option === "") return

        if (option === "US" & authors.length === 0) { callApi();  addDeleteButton();return }


        const asArray = Object.entries(allCards);
        let arr = []
        if (option === "US") {
            addDeleteButton()
            return

        } else {
            arr = (asArray.filter(([key, value]) => value.type === option));


            arr = (asArray.filter(([key, value]) => value.type === option));
            let filtered = []
            arr.forEach(element => {
                filtered[element[0]] = element[1]


            });

            setCards(filtered)
            console.log(option)
            addDeleteButton()
        }

        ;

    }
    function callApi() {
        let link = ""

        if (option === "US") {
            link = LINK_BACKEND + "/api/userprofile/users/?search=" + search
        } else {
            link = LINK_BACKEND + "/api/catalog/?search=" + search
        }
        fetch(
            link)
            .then((res) => res.json())
            .then(data => {
                if (option === "US") {
                    setAuthors(data)

                } else {
                    setCards(data);
                    setAllCards(data)

                }

            }
            )
    }


    function RenderCard(card, index) {
        if (option === "US") {
            return (
                <a style={{ margin: "0.5%", textDecoration: 'none' }} href={"/profile/" + card.user_name} key={card.id}>
                    <div className="card custom search-card">
                        <picture >
                            <img style={{ marginTop: "10px" }} id={index} src={card.photo} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
                        </picture>
                        <div className="card-body ">
                            <div className='grid' style={{ justifyContent: "inherit" }}>
                                <h5 style={{ color: "black" }}><strong>{card.user_name}</strong></h5>
                                <p className="card-text max">{card.description}</p>
                            </div> 
                        </div>
                    </div>
                </a>
            )
        }
        return (

            <a style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + card.id} key={card.id}>
                <div className="card custom search-card">
                    <picture >
                        <img id={index} src={card.images[0]} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
                    </picture>
                    <div className="card-body ">
                        <h5 className='max' style={{ color: "black" }}><strong>{card.price}€</strong></h5>
                        <h5 style={{ color: "black" }} className="card-title max-title"><strong>{card.title}</strong></h5>
                        <p className="card-text max"><small>{card.author.user_name}</small>  </p>
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
        
        setOption("CO")
       

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
        
        setOption("AR")
    


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
        setOption("US")

    }

    function removeFilter(e) {
        if (option==="CO") document.getElementById("box1").classList.toggle("active")
        else if (option==="AR") document.getElementById("box2").classList.toggle("active")
        else document.getElementById("box3").classList.toggle("active")
        setOption("All")
        setComponents([])
    }
    function addDeleteButton(){
        let text = ""
        console.log(option)
        if (option==="CO") text = "Comision"
        else if (option==="AR") text = "Arte"
        else text = "Usuarios"
        setComponents([<button onClick={removeFilter} className='button-filters'>{text}<span className="remove-icon"> × </span></button>])
    }
    function renderButton(element) {
        return element
    }




    return (
        <div>
            <div style={{ minHeight: "88vh", backgroundColor: "white", marginInlineStart: "5%", marginInlineEnd: "5%", borderRadius: "20px", marginBlockEnd: "1%" }}>
                <div style={{ paddingTop: "5%" }}>
                    <div className="header-container ">
                        <h1 style={{ color: "black" }}>Resultados de {search}..</h1>
                        <p >{cards.length} resultado/s encontrado/s</p>
                    </div>
                    <div className='grid input-grid'>
                        <div className="input-group custom-input">
                            <input onKeyDown={(e) => enterEvent(e)} defaultValue={search} onChange={e => setContent(e.target.value)} type="search" placeholder="Try: Dragon ball drawings" aria-describedby="button-addon1" className="form-control border-0 bg-light" />
                            <div className="input-group-append">
                                <button onClick={goSearch} id="button-addon1" type="submit" className="btn btn-link text-primary"><BsSearch /></button>
                            </div>
                        </div>
                        <div className='grid search-grid'>
                            <div className="box1" id="box1" onClick={selectComision}>

                                <AiFillWechat className="icons" />
                            </div>
                            <div className="box2" id="box2" onClick={selectArt}>
                                <BsBrushFill className="icons " />
                            </div>
                            <div className="box3" id="box3" onClick={selectUsers}>
                                <BsFillPersonFill className="icons" />
                            </div>
                        </div>
                        <div className="selected-filters">
                            {component.map(renderButton)}

                        </div>
                    </div>
                    <div className="grid custom-grid">
                        {(option === "US") ? authors.map(RenderCard) : cards.map(RenderCard)}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Search;
