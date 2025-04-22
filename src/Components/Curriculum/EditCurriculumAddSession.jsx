import React, { useEffect, useState } from 'react';
import './editCurriculum.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useLocation, useNavigate } from 'react-router-dom';
import AccordianCurriculum from '../Common/AccordianCurriculum/AccordianCurriculum';
import { callAPI, removeDuplicateObjects } from '../../Helper';
import Loader from '../Common/Loader/Loader';

function EditCurriculumAddSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const [addSession, setAddSession] = useState([]);
  const [loader, setLoader] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [nameCheck, setNameCheck] = useState(false);
  const [currName, setCurrName] = useState('');

  const setSessionAll = (session) => {
    setAddSession([...addSession, session]);
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
    setLoader(true);
    callAPI(
      'get',
      `https://7nluheb3kb.execute-api.us-east-1.amazonaws.com/testing/check_availability?name=${currName}`
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          setNameCheck(true);
        } else {
          setNameCheck(false);
          const transformedS = addSession.map((item) => {
            return {
              gameName: item?.gameName, //?.map((game) => game.value).join(','),
              gameMode: item?.gameMode, //?.map((mode) => mode.value).join(','),
              skillToFocus: item?.skillToFocus?.map((skillToFocus) => skillToFocus.value).join(',')
            };
          });
          callAPI(
            'post',
            'https://d6mqosu8sl.execute-api.us-east-1.amazonaws.com/testing/curriculum',
            {
              noOfSessions:
                parseInt(location.state?.noOfSessions) + parseInt(location.state.addNewSession),
              nameOfPreset: currName,
              assignedTo: '',
              session: removeDuplicateObjects(
                [...location.state.sessions, ...transformedS],
                ['gameName', 'gameMode', 'skillToFocus']
              )
            }
          )
            .then((res) => {
              console.log(res);
              navigate('/curriculum');
              setLoader(false);
            })
            .catch((error) => {
              console.log(error);
              setLoader(false);
            });
        }
        // setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="create-curr4-container curr5">
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
        lastValue={'Edit Preset'}
      />
      <div className="accounts-header">
        <h1> Edit Preset</h1>
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
                  <p>{location.state.noOfSessions}</p>
                </div>
              </div>
              <div className="curr4-form-right">
                <div className="curr4-flex">
                  <h4>Name of this preset. </h4>
                  <div className="edit-curr-input-box">
                    <input
                      autoComplete="off"
                      onChange={(event) => {
                        const value = event.target.value;
                        setCurrName(value);
                      }}
                    />
                    {nameCheck ? (
                      <p className="add-school-error-curr">{`⚠ Name Already Exist`}</p>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* <p>{location.state.nameOfPreset}</p> */}
                </div>
              </div>
            </div>
            <div className="curr4-form-row-1">
              <div className="curr4-form-left">
                <div className="curr4-flex">
                  <h4>Number of new sessions you want to add this curriculum preset. </h4>
                  <p>{location.state.addNewSession}</p>
                </div>
              </div>
            </div>
            <hr />

            {Array.from({ length: location.state?.addNewSession }, (_, index) => (
              <>
                <AccordianCurriculum
                  key={index}
                  name={`Session ${parseInt(location.state.noOfSessions) + index + 1} details`}
                  setSession={setSessionAll}
                  gameData={gameData}
                />
                {index === location.state?.addNewSession - 1 ? null : <hr />}
              </>
            ))}
          </div>

          <div className="create-curr4-submit">
            <button className="create-curr4-submit-btn" onClick={onSubmit}>
              Save this preset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EditCurriculumAddSession;
