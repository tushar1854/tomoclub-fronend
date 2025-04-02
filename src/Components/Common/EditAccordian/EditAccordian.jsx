import React, { useState } from 'react';

const EditAccordian = ({ name, gameName, gameMode, gameObjectives }) => {
  const [show, setShow] = useState(true);
  return (
    <>
      {show ? (
        <div className="accordian-closed">
          <div className="accordian-closed-container" onClick={() => setShow(false)}>
            <h4>{`+ ${name} `}</h4>
          </div>
        </div>
      ) : (
        <div className="accordian">
          <div className="accordian-left left">
            <h4 className="acc-left-head">{`- ${name} `}</h4>
          </div>
          <div className="accordian-right right">
            <div className="accordian-right-row">
              {/* <div className="edit-preset-row">
                <p className="edit-p1">Name of session:</p>
                <p>TFS_session_01</p>
              </div> */}
              <div className="edit-preset-row">
                <p className="edit-p1">Game name:</p>
                <p>{gameName}</p>
              </div>
              <div className="edit-preset-row">
                <p className="edit-p1">Game mode:</p>
                <p>{gameMode}</p>
              </div>
              <div className="edit-preset-row">
                <p className="edit-p1">Game objectives:</p>
                <p>{gameObjectives}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAccordian;
