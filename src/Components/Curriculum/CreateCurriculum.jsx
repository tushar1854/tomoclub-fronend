import React, { useEffect, useState } from 'react';

import './createCurriculum.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
// import AccordianSelect from '../Common/Acordian-Select/AccordianSelect';
// import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AccordianCurriculum from '../Common/AccordianCurriculum/AccordianCurriculum';
import Loader from '../Common/Loader/Loader';
import { callAPI, removeDuplicateObjects } from '../../Helper';

function CreateCurriculum() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionCurriculum, setSessionCurriculum] = useState([]);
  const [loader, setLoader] = useState(false);
  const [buttonError, setButtonError] = useState(false);
  const [gameData, setGameData] = useState([]);

  const setSessionAll = (session) => {
    setSessionCurriculum([...sessionCurriculum, session]);
  };

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://mslpuh4oe1.execute-api.us-east-1.amazonaws.com/testing/game_name')
      .then((res) => {
        console.log(res);
        setGameData(res);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const transformedS = sessionCurriculum.map((item) => {
      return {
        gameName: item?.gameName, //?.map((game) => game.value)?.join(','),
        gameMode: item?.gameMode, //?.map((mode) => mode.value)?.join(','),
        skillToFocus: item?.skillToFocus?.map((skillToFocus) => skillToFocus.value).join(',')
      };
    });
    console.log(
      'a',
      sessionCurriculum.length,
      'b',
      location.state?.noOfSessions,
      'c',
      sessionCurriculum
    );
    if (sessionCurriculum.length == location.state?.noOfSessions) {
      setLoader(true);
      callAPI('post', 'https://d6mqosu8sl.execute-api.us-east-1.amazonaws.com/testing/curriculum', {
        noOfSessions: location.state?.noOfSessions,
        nameOfPreset: location.state?.nameOfPreset,
        assignedTo: '',
        session: removeDuplicateObjects(transformedS, ['gameName', 'gameMode', 'skillToFocus'])
      })
        .then((res) => {
          console.log(res);
          navigate('/curriculum');
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setButtonError(true);
    }
  };

  return (
    <div className="create-curr4-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Curriculum',
            link: '/curriculum'
          }
        }}
        lastValue={'Create Preset'}
      />
      <div className="accounts-header">
        <h1> Create Preset</h1>
      </div>

      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="create-curr4-form-container">
            <div className="curr4-form-row-1">
              <div className="curr4-form-left">
                <div className="curr4-flex">
                  <h4>Number of sessions in this preset. </h4>
                  <p>{location.state?.noOfSessions}</p>
                </div>
              </div>
              <div className="curr4-form-right">
                <div className="curr4-flex">
                  <h4>Name of this preset. </h4>
                  <p>{location.state?.nameOfPreset}</p>
                </div>
              </div>
            </div>
            <hr />
            {Array.from({ length: location.state?.noOfSessions }, (_, index) => (
              <>
                <AccordianCurriculum
                  key={index}
                  name={`Session ${parseInt(index) + 1} details`}
                  setSession={setSessionAll}
                  gameData={gameData}
                />
                {index === location.state?.noOfSessions - 1 ? null : <hr />}
              </>
            ))}
          </div>
          <div className="create-curr4-submit">
            <button className="create-curr4-submit-btn" onClick={onSubmit}>
              Save this preset
            </button>
            {buttonError && <p className="button-error">{`⚠ Please select the session.`}</p>}
            {/* {selectError ? <p className="add-school-error">{`⚠ This input is required.`}</p> : <></>} */}
          </div>
        </>
      )}
    </div>
  );
}

export default CreateCurriculum;
