import './home.css'
import { BsSearch, BsWindowSidebar } from "react-icons/bs";
import LINK_FRONTEND from './LINK_FRONTEND';
import { useState } from 'react';

const Home = () => {
  const [content, setContent] = useState();

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

  return (
    <div name='home' style={{height:"80vh"}} >
      <div className="d-flex align-items-center justify-content-center landName row">
        <div className="col-sm"></div>
        <div className="col-sm">
          <div className="row">
            <div className="col-sm">
            </div>
            <div className="col-sm custom-margin">
              <h1 className="w-100 pb-4">Art is not what you see, but what you make <i> others </i> see.</h1>
              <div className="bg-white rounded shadow">
                <form action="" />
                <div className="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
                  <div className="input-group">
                    <input id="search-bar" onKeyDown={(e) => enterEvent(e)} onChange={e => setContent(e.target.value)} type="search" placeholder="Try: Dragon ball drawings" aria-describedby="button-addon1" className="form-control border-0 bg-light" />
                    <div className="input-group-append">
                      <button onClick={goSearch} id="button-addon1" type="submit" className="btn btn-link text-primary"><BsSearch /></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex my-4 row">
                <div className="col-2">
                  <p style={{ color: "white" }}><strong> Popular: </strong></p>

                </div>
                <div className="col-lg landingTags">
                  <span className="landingTextSpan">Disney</span>
                  <span className="landingTextSpan">Dragon Ball</span>
                  <span className="landingTextSpan">Tokyo Ghoul</span>
                </div>


              </div>
            </div>
            <div className="col-sm">

            </div>
          </div>
        </div>
        <div className="col-sm"></div>

      </div>
    </div>
  );
}

export default Home;