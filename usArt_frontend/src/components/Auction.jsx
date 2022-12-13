import "./Auction.css"
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/authcontext";
import LINK_BACKEND from "./LINK_BACKEND";
import LINK_RESOURCES from "./LINK_RESOURCES";
import Pusher from 'pusher-js'
import imageP from '../assets/not-found-image.jpg'
function Auction(props) {
    let { user, authTokens } = useContext(AuthContext);
    const [bestBid, setBestBid] = useState(0);
    const [lastBid, setlastBid] = useState(0)
    const [bidHistory, setbidHistory] = useState([])
    const [card, setCard] = useState([]);

    const { id } = useParams();


    useEffect(callApi, [])


    useEffect(() => {
        if (lastBid != 0) {
            let jsonpar = (JSON.parse(lastBid))
            const asArray = Object.entries(bidHistory);
            let arr = (asArray.filter(([key, value]) => value.user_id.user_name != jsonpar.user_id.user_name));
            
            arr.push([arr.length,jsonpar])
            let filtered = []
            arr.forEach(element => {
                filtered.push(element[1])
            });
            filtered.sort(function(a, b){return b.bid- a.bid});
            
            setbidHistory(filtered);
        }
    }, [lastBid]);

    const saveBid = (data) => {

        setlastBid(JSON.stringify(data))
    };

    let pusher = new Pusher("464bf9750a028fa769ca", {
        cluster: "eu",
    });
    let channel = pusher.subscribe(id);
    channel.bind('subasta', saveBid);

    function callApi() {
        fetch(
            LINK_BACKEND + "/api/catalog/auction/get/" + id)
            .then((res) => res.json())
            .then(data => {
                setCard(data);
                if (data.pub_id.images.length === 0) {
                    data.pub_id.images.push(imageP)
                    setCard(data);
                }
            }
            )
        fetch(
            LINK_BACKEND + "/api/catalog/auction/bidlist/" + id)
            .then((res) => res.json())
            .then(data => {
                setbidHistory(data)
                setBestBid(data[0].bid)

            }
            )
    }

    if (card.length === 0) {
        return (
            <div className='center'>
                <div className="loader">
                    <div className="loader-wheel"></div>
                    <div className="loader-text"></div>
                </div>
            </div>)
    }

    function renderCard(card, index) {
        if (index === 0) return (
            <div className="carousel-item active" data-bs-interval="30000">
                <img id={index} src={card} style={{ height: "25vh" }} className="img-slider" alt="Sorry! not available at this time" ></img>
            </div>
        )
        return (
            <div className="carousel-item" data-bs-interval="30000">
                <img id={index} src={card} style={{ height: "25vh" }} className="img-slider" alt="..."></img>
            </div>
        )
    }
    function renderButtons(cards, index) {
        let label_i = "Slide " + (index + 1)
        let index_ = (index)
        if (card.pub_id.images.length === 1) return
        if (index_ === 0) {
            return (
                <button className="active" key={index}
                    type="button" data-bs-target="#carouselExampleControls" data-bs-slide-to={index_}
                    aria-label={label_i} aria-current="true" ></button>
            )
        }


        return (
            <button key={index}
                type="button" data-bs-target="#carouselExampleControls" data-bs-slide-to={index_}
                aria-label={label_i}></button>
        )
    }
    function auctions(product) {
        if (bidHistory == undefined) return
        return (
            <div>
                <a style={{ textDecoration: 'none' }} href={"/profile/" + product.user_id.user_name + "/default"} key={product.id}>
                    <div className='d-flex rounded productRow text-center align-items-center' style={{ backgroundColor: "white" }}>
                        <img src={product.user_id.photo} style={{ maxWidth: "4vmax" }} className="imageProducts shadow rounded" alt="Sorry! not available at this time" ></img>
                        <p style={{ color: "black", marginLeft: "15px" }}> {product.user_id.user_name} made an offer of:  {product.bid} €</p>
                    </div>
                </a>
                <hr style={{ marginBlockStart: "1em", marginInlineEnd: "12px" }}></hr>
            </div>

        )

    }

    function checkNumbers(e) {
        let input_textarea_price = document.getElementById('bidpost');
        let buttonPrice = document.getElementById('bidbutton');
        if (input_textarea_price.value == "" | input_textarea_price.value < card.pub_id.price) buttonPrice.disabled = true
        else buttonPrice.disabled = false
        if (input_textarea_price.value > 10) {
            if (input_textarea_price.value[5] === ".") input_textarea_price.value = input_textarea_price.value.slice(0, 4);
            else { input_textarea_price.value = input_textarea_price.value.slice(0, 6); }
        }
    }
    function postBid() {
        let input_textarea_price = document.getElementById('bidpost');
        fetch(
            LINK_BACKEND + "/api/catalog/auction/bid/", {
            method: 'PUT',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'pub_id': id,
                'bid': input_textarea_price.value,
            })
        })
            .then((res) =>
                
                res.json()
            )


    }


    return (
        <div className="subasta">
            <div className="custom-container auc" style={{ marginBlockStart: "0" }}>
                <div id="carouselExampleControls" className="carousel carousel-dark  slide" data-bs-ride="carousel"  >
                    <div className="carousel-indicators">
                        {card.pub_id.images.map(renderButtons)}
                    </div>
                    <div className="carousel-inner " >
                        {card.pub_id.images.map(renderCard)}
                    </div>
                    {card.pub_id.images.length > 1 ? <div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div> : <div></div>
                    }
                </div>
                <div style={{ marginTop: "0" }} className="card-body custom-body ">
                    <div style={{ margin: "0" }}>
                        <h2 style={{ color: "black", marginBottom: "0.2rem", marginTop: "2%" }}>{card.pub_id.title}</h2>
                        <h4 style={{ color: "black" }}>{"Initial price: " + card.pub_id.price}€</h4>
                        <p style={{ color: "black", marginBottom: "0.2rem" }}> Author: {card.pub_id.author.user_name}</p>
                    </div>
                    <hr style={{ marginBlockStart: "0.2em", marginBlockEnd: "0.2em" }}></hr>
                    <div class="btn-toolbar justify-content-between align-items-center" role="toolbar" aria-label="Toolbar with button groups" style={{ marginBottom: "0.5rem" }}>
                        <div class="btn-group" role="group" aria-label="First group">
                            <h3 style={{ color: "black", marginBottom: "3%" }}>{"Best Bid: " + bestBid}€ </h3>
                        </div>
                        <div class="input-group field">
                            <input  defaultValue={ card.pub_id.price} type="number" id="bidpost" onChange={checkNumbers} placeholder="Place your bid" />
                            <button onClick={postBid} disabled={user == undefined} type="button" id="bidbutton">Bid</button>
                        </div>
                    </div>
                    <div className="auctionsList" id="scrollbar-3">
                        {bidHistory.map(auctions)}
                    </div>
                </div>

            </div>
        </div>
    )

}
export default Auction;