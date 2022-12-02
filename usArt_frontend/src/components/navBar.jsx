import { Component } from "react";
import './navBar.css';
import { useContext } from "react";
import AuthContext from "../context/authcontext";


//#TODO: Poner lo de underL en la NoLogged
function NoLoggedNavBar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light " aria-label="Offcanvas navbar small">
      <div className="container-fluid">
        <a className="navbar-brand i p-4" id="navBar-brand" href="/home"><h1>UsArt</h1></a>
        <button className="navbar-toggler"
          type="button" style={{background:"white"}}
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar2"
          aria-controls="offcanvasNavbar2">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-start text-bg-dark" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
          <div className="offcanvas-header">
            <a  className="nav-link active"  id="offcanvasNavbar2Label" href="/home"><h1>UsArt</h1> </a>
            <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3" style={{zIndex:"2"}}>
                <li className="nav-item px-3">
                  <a  className="nav-link active underL px-3" aria-current="page" href="/explore">Explore</a>
                </li>
                <li className="nav-item px-3">
                  <a id="button_login" className="nav-link underL px-3" href="/login">Log in</a>
                </li>
                <li className="nav-item px-3">
                  <a id="button_join" className="nav-link  px-3 landingNoRegisterJoin" href="/join">Join</a>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
function LoggedNavBar() {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-expand-sm navbar-light" aria-label="Offcanvas navbar small">
      <div className="container-fluid">
        <a className="navbar-brand p-4 " href="/home"><h1>UsArt</h1></a>
        <button style={{background:"white"}} className="navbar-toggler" id="button"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar2"
          aria-controls="offcanvasNavbar2"
          >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-start text-bg-dark"  id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbar2Label">UsArt</h5>
            <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 " style={{zIndex:"2"}}>
                <li className="nav-item px-3">
                  <a id="explore_button" className="nav-link active underL px-3" aria-current="page" href="/explore">Explore</a>
                </li>
                <li className="nav-item px-3">
                  <a  className="nav-link underL px-3" href="/buzon">Buzon</a>
                </li>
                <li className="nav-item px-3">
                  <a  className="nav-link underL px-3" href={"/profile/"+user.username}>Mi perfil</a>
                </li>
                <li className="nav-item px-3 ">
                  <a  className="nav-link underL px-3" href="/home" onClick={logoutUser}>Log Out</a>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default class navBar extends Component {
  constructor(props) {
    super(props);
    this.logged = props.logged;

  }
  render() {
    //#IMPORTANT: Quitar la negación.
    if(this.logged){
      return <LoggedNavBar/>
    }else{
      return <NoLoggedNavBar/>
    }
  }


}