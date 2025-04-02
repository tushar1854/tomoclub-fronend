import React from 'react';

import './header.css';
// import search from '../../assets/icons/search.svg';
// import horizontalLine from '../../assets/icons/horizontalLine.svg';
// import fullScreen from '../../../assets/icons/fullScreen.svg';
import { getSessionStorage } from '../../../Helper';
import { UserAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { logOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (e) {
      console.log(e.message);
    }
  };
  const profilePicture =
    JSON.parse(getSessionStorage('user'))?.photoURL ||
    'https://lh3.googleusercontent.com/a/AAcHTtdyDkiJ3aUcX3OoG1wbR8fv9a8Wm5SIwTsQzww4fzwb=s96-c';
  return (
    <div className="header">
      <div className="header-left">
        {/* <button className="header-btn">
          <input type="text" className="header-input" placeholder="Search " />
          <img src={horizontalLine} alt="" />
          <img src={search} className="header-search" alt="" />
        </button> */}
      </div>
      <div className="header-right">
        {/* <select name="TomoClub Admin" id="">
          <option value="TomoClub Admin" selected></option>
          <option value="TomoClub Admin" selected></option>
          <option value="TomoClub Admin" selected></option>
          <option value="TomoClub Admin" selected></option>
        </select> */}

        {/* <a href="">
          <img src={fullScreen} alt="fullScreen" />
        </a> */}
        <a className="header-right-notify" onClick={handleLogout}>
          <img src={profilePicture} alt="notify" onClick={handleLogout} />
        </a>
      </div>
    </div>
  );
};

export default Header;
