import { Component } from "react";
import './explorerStyles.css'
import imageP from '../assets/not-found-image.jpg'
import imageP2 from '../assets/pincel.jpg'
import { useState, useEffect } from "react";
import LINK_BACKEND  from "./LINK_BACKEND";
import Footer from './footer';

export default function Explorer() {

  const [cards, setCards] = useState([]);

  useEffect(callApi, [])

  function callApi() {
    fetch(
      LINK_BACKEND+"/api/catalog/")
      .then((res) => res.json())
      .then(data => {
        setCards(data)
      }
      )
  }

  if (cards.length === 0) {
    return (
        <div className='center body_register'>
            <div  class="loader">
                <div className="loader-wheel"></div>
                <div className="loader-text"></div>
            </div>
        </div>)
}

  function RenderCard(card, index) {
    return (

      <a id="card_container" style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + card.id} key={card.id}>
        <div className="card custom ">
          <picture >
            <img id={index} src={card.images[0]} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
          </picture>
          <div className="card-body ">
            <h5 className="max" style={{ color: "black" }}><strong>{card.price}€</strong></h5>
            <h5 id="card_title" style={{ color: "black" }} className="card-title max-title"><strong>{card.title}</strong></h5>
            <p className="card-text max-text"><small>{card.author.user_name}</small>  </p>
            <p className="card-text max">{card.description}</p>
          </div>

        </div>
      </a>
    )
  }



  return (
    <div style={{overflowX:"hidden"}}className="body_register">
      <div className="row header border">
        <h1>Explore the talent at UsArt</h1>
        <p style={{ color: "white" }}>Thousands of people offer art services daily</p>
      </div>
      <div className="grid grid-explorer ">
        {cards.map(RenderCard)}
      </div>
      <Footer/>
    </div>
    
    )
}



