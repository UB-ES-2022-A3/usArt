import { Component } from "react";
import './explorerStyles.css'
import imageP from '../assets/not-found-image.jpg'
import imageP2 from '../assets/pincel.jpg'
import { useState, useEffect } from "react";


export default function Explorer() {

  const [cards, setCards] = useState([]);

  useEffect(callApi, [])

  function callApi() {
    fetch(
      "https://usart-backend.azurewebsites.net/catalog/")
      .then((res) => res.json())
      .then(data => {
        setCards(data)
      }
      )
  }

  if (cards.length === 0) return <div className="errorApi"><h1>Cargando..</h1></div>

  function RenderCard(card, index) {
    return (
      <a style={{ margin: "1%", textDecoration: 'none' }} href={"/publicacion/" + card.id} key={card.id}>
        <div className="card custom ">
          <picture >
            <source srcSet={card.image} ></source>
            <img id={index} src={imageP} className="card-img-top size-img" alt="Sorry! not available at this time" ></img>
          </picture>
          <div className="card-body ">
            <h5 style={{ color: "black" }}><strong>{card.price}€</strong></h5>
            <h5 style={{ color: "black" }} className="card-title max-text"><strong>{card.title}</strong></h5>
            <p className="card-text max-text"><small>{card.author}</small>  </p>
            <p className="card-text max">{card.description}</p>
          </div>
        </div>
      </a>
    )
  }



  return (
    <div>
      <div className="row header border">
        <h1>Explore el talento en UsArt</h1>
        <p style={{ color: "white" }}>Miles de personas ofrecen servicios de arte diariamente</p>
      </div>
      <div className="grid ">
        {cards.map(RenderCard)}
      </div>
    </div>)
}



