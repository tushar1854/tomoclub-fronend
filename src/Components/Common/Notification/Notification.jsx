import React from 'react';

import './notification.css';
import sucessIcon from '../../../assets/sucessIcon.svg';
import errorIcon from '../../../assets/warnIcon.svg';
import crossIcon from '../../../assets/crossIcon.svg';

const Notification = ({ icon, data, blur, setBlur }) => {
  return (
    <div className={`school-success-container ${blur && 'activeNotification'}`} id="popup">
      <div className="school-success-box">
        <div
          id="school-success-icon"
          onClick={() => {
            setBlur(false);
            document.body.style.overflow = 'scroll';
          }}
        >
          <img
            src={crossIcon}
            onClick={() => {
              setBlur(false);
              document.body.style.overflow = 'scroll';
            }}
            id="school-success-cross"
            alt=""
          />
        </div>
        <div className="school-success-internal">
          <img src={icon ? sucessIcon : errorIcon} alt="" id="school-success-tick" />
          <h2>{data}</h2>
        </div>
      </div>
    </div>
  );
};

export default Notification;
