import React from 'react';
import './HomeContent.css';

// import homeGame from '../../../assets/homeGame.svg';
// import homeKing from '../../../assets/homeKing.svg';
// import homeTarget from '../../../assets/homeTarget.svg';

const HomeContent = ({
  title,
  addCard1,
  addCard2,
  addCard3,
  // statsCard1,
  // statsCard2,
  // statsCard3,
  schoolData
}) => {
  return (
    <div className="home-content-start">
      <div className="homeContent-heading">
        <h1>{title}</h1>
      </div>

      <div className="homeContent-box">
        <div className="homeContent-box1" id="homeContent-box-A">
          <div className="homeContent-box1-upper">
            <p>{addCard1}</p>
            {/* <button className="homeContent-box1-upper-btn">Modify</button> */}
          </div>
          <div className="homeContent-box1-lower">
            <h1>{schoolData.studentCount}</h1>
          </div>
        </div>
        <div className="homeContent-box1" id="homeContent-box-B">
          <div className="homeContent-box1-upper">
            <p>{addCard2}</p>
            {/* <button className="homeContent-box1-upper-btn">Modify</button> */}
          </div>
          <div className="homeContent-box1-lower">
            <h1>{schoolData.teacherCount}</h1>
          </div>
        </div>
        <div className="homeContent-box1" id="homeContent-box-C">
          <div className="homeContent-box1-upper">
            <p>{addCard3}</p>
            {/* <button className="homeContent-box1-upper-btn">Modify</button> */}
          </div>
          <div className="homeContent-box1-lower">
            <h1>{schoolData?.schoolCount || 0}</h1>
          </div>
        </div>
      </div>
      {/* <div className="homeContent-heading">
        <p>Stats and Reports</p>
      </div>
      <div className="homeContent-box">
        <div className="homeContent-box2">
          <img src={homeGame} alt="" className="homeContent-img" />
          <h1>{statsCard1}</h1>
          <p>Gaming hours spent</p>
        </div>
        <div className="homeContent-box2">
          <img src={homeTarget} alt="" className="homeContent-img" />
          <h1>{statsCard2}</h1>
          <p>Average game score</p>
        </div>
        <div className="homeContent-box2">
          <img src={homeKing} alt="" className="homeContent-img" />
          <h1>{statsCard3}</h1>
          <p>Game completion rate</p>
        </div>
      </div> */}
    </div>
  );
};

export default HomeContent;
