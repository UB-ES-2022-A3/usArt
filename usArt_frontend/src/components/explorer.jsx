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
      "http://localhost:8000/catalog/")
      .then((res) => res.json())
      .then(data => {
        setCards(data)
      }
      )
  }

  if (cards.length === 0) return <div class="errorApi"><h1>Cargando..</h1></div>

  function RenderCard(card, index) {

    return (
      <div class="card custom" key={index}  >
        <picture >
          <source  srcset={card.images[0]} ></source>
          <img id={index} src={imageP} class="card-img-top size-img" alt="Sorry! not available at this time" ></img> 
        </picture>
        <div class="card-body">
          <h5 style={{ color: "black" }} class="card-title">{card.title}</h5>
          <p >{card.price}€</p>
          <p class="card-text max">{card.description}</p>
        </div>
      </div>)
  }



  return (
    <div>
      <div class="row header border">
        <h1>Explore el talento en UsArt</h1>
        <p style={{ color: "white" }}>Miles de personas ofrecen servicios de arte diariamente</p>
      </div>
      <div class="grid ">
        {cards.map(RenderCard)}
      </div>
    </div>)
}



