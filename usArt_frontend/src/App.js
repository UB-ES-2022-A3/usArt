import NavBar from './components/navBar';
import video from "./assets/bgVideo.mp4"
import Home from './components/Home';
import Register from './components/registerForm'
import LogIn from './components/loginForm'
import Explorer from './components/explorer';
import Profile from './components/profile';
import Publicacion from './components/publicacion';
import Search from './components/search';
import "./app.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Form,
  useHistory 
} from "react-router-dom";

function VideoBG(){
  if(window.location.href.includes('home')){
    return (<video className="video"
    src = {video}
    autoPlay={true} muted={true}loop={true}
  ></video>);
  }else{
    //document.html.style.backgroundImage = "url('assets/image1.jpg')";
  }
}


function NavbarSelector(){
  if(!window.location.href.includes('join') && (!window.location.href.includes('login')) ){
    return <NavBar logged={false} />
  }
}



function App() {
  return (
    <div className="main" id="main" >
      <VideoBG/>
      <div className="content  ">
        <NavbarSelector/>
        <Router>
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/explore" element={<Explorer />}></Route>
            <Route path="/join" element={<Register />}></Route>
            <Route path="/login" element={<LogIn />}></Route>
            <Route path="/profile/:username" element={<Profile />}></Route>
            <Route path="/publicacion/:id" element={<Publicacion />}></Route>
            <Route path="/search/:search/:id" element={<Search/>}></Route>

          </Routes>
        </Router>
      </div>
    </div>

  );
}


export default App;
