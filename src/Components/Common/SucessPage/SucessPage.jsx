import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './sucessPage.css';
import tomoclub from './assets/tomoclub.png';
import vector from './assets/vector.png';

const SucessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="success-box">
      <div id="success-logo">
        <img src={tomoclub} alt="" />
      </div>
      <div id="success-done">
        <img src={vector} alt="" />
      </div>
      <h2 id="success-head"> {location.state.title}</h2>
      <p id="success-para">{location.state.description}</p>
      {/* <h2 id="success-head">We received your bussiness query</h2>
      <p id="success-para">
        Your account is pending approved. Please contact TomoClub at support@tomoclub.org.
      </p> */}
      <button className="success-btn" onClick={() => navigate('/')}>
        Take me back home
      </button>
    </div>
  );
};

export default SucessPage;
