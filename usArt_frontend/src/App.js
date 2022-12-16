import NavBar from './components/navBar';
import video from "./assets/bgVideo.mp4"
import Home from './components/Home';
import Register from './components/registerForm'
import LogIn from './components/loginForm'
import Explorer from './components/explorer';
import Profile from './components/profile';
import Publicacion from './components/publicacion';
import Search from './components/search';
import Compra from './components/compra';
import Auction from './components/Auction';
import Details from './components/purchaseDetails';
import Error from './components/error';      
import BuzonTest from './components/buzonChat';
import LINK_FRONTEND from './components/LINK_FRONTEND';
import TermsAndConditions from './components/termsAndConditions';
import { AuthProvider } from './context/authcontext';
import { useContext } from "react";
import AuthContext from "./context/authcontext";
import "./app.css"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


function VideoBG(){
  if(window.location.href.includes('home')){
    return (<video className="video"
    src = {video}
    autoPlay={true} muted={true}loop={true}
  ></video>);
  }
  if ( window.location.href === LINK_FRONTEND+"/" | window.location.href === LINK_FRONTEND){
    window.location.assign(LINK_FRONTEND + "/home")
  }
}


function NavbarSelector(){
  let { user } = useContext(AuthContext);
  if(!window.location.href.includes('join') && (!window.location.href.includes('login')) ){
    return <NavBar logged={user !== null}/>
  }
}



function App() {
  return (
    
    
    <Router>
    <div className="main" id="main" >
      <AuthProvider>
        <VideoBG/>
        <div className="content">
          <NavbarSelector/>
            <Routes>
              <Route path="/home" element={<Home />}></Route>
              <Route path="/buzon" element={<BuzonTest />}></Route>
              <Route path="/explore" element={<Explorer />}></Route>
              <Route path="/join" element={<Register />}></Route>
              <Route path="/login" element={<LogIn />}></Route>
              <Route path="/profile/:username/:edit" element={<Profile />}></Route>
              <Route path="/publicacion/:id" element={<Publicacion />}></Route>
              <Route path="/search/:search" element={<Search/>}></Route>
              <Route path="/termsandconditions" element={<TermsAndConditions />}></Route>
              <Route path="/compra/:id" element={<Compra/>}></Route>
              <Route path="/purchasedetails/:id" element={<Details/>}></Route>
              <Route path="/auction/:id" element={<Auction/>}></Route>
              <Route path="*" element={<Error/>}></Route>
            </Routes>
        </div>
      </AuthProvider>
    </div>
    </Router>
  );
}


export default App;
