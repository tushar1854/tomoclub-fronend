import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
// import AccordianCurriculum from '../../Common/AccordianCurriculum/AccordianCurriculum';
import AccordianSession from '../../Common/AccordianSession/AccordianSession';
import { useLocation, useNavigate } from 'react-router-dom';
import { callAPI } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';

const AddSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  const [loader, setLoader] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [moderator, setModerator] = useState([]);

  const setSessionAll = (sessionDetail) => {
    setSession({ ...session, ...sessionDetail });
  };

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://mslpuh4oe1.execute-api.us-east-1.amazonaws.com/testing/game_name')
      .then((res) => {
        console.log(res);
        setGameData(res);
      })
      .catch((error) => {
        console.log(error);
      });
    callAPI('get', 'https://cy60lxn6el.execute-api.us-east-1.amazonaws.com/testing/moderator_read')
      .then((res) => {
        console.log(res);
        setModerator(res);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = () => {
    console.log({
      cohortUid: location.state.cohortUid,
      info: session
    });

    setLoader(true);
    callAPI(
      'post',
      'https://ovlzwl8vvi.execute-api.us-east-1.amazonaws.com/testing/session-insert',
      {
        cohortUid: location.state.cohortUid,
        info: session
      }
    )
      .then((res) => {
        console.log(res);
        navigate('/session');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="addSession">
      <div className="create-curr4-container">
        <BreadcrumbsLink
          breadcrumbValues={{
            1: {
              name: 'Home',
              link: '/home'
            },
            2: {
              name: 'Session',
              link: '/session'
            }
          }}
          lastValue={'Add session'}
        />
        <div className="accounts-header">
          <h1> Add Session Details</h1>
        </div>

        <div className="session-head-desc">
          <div className="desc-column">
            <div className="left-desc">
              <p className="first-p">Experts:</p> <p>{location.state.moderator}</p>
            </div>
            <div className="right-desc">
              <p className="first-p"> Cohort Timing:</p>{' '}
              <p>
                {location.state.day} | {location.state.time} | {location.state.timeZone}
              </p>
            </div>
          </div>
          <div className="desc-column">
            <div className="left-desc">
              <p className="first-p">Cohort Name: </p>
              <p> {location.state.cohortName}</p>
            </div>
            <div className="right-desc"></div>
          </div>
          <div className="desc-column">
            <div className="left-desc">
              <p className="first-p">No of session to plan: </p>
              <p> {location.state.selectedNoOfSessions}</p>
            </div>
            <div className="right-desc">
              <p className="first-p">Session Date:</p>
              <p> {location.state.startDate}</p>
            </div>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div className="create-curr4-form-container">
              {Array.from({ length: location.state?.selectedNoOfSessions }, (_, index) => (
                <>
                  <AccordianSession
                    key={index}
                    name={`Session ${parseInt(index) + location.state.plannedSessions + 1} details`}
                    setSession={setSessionAll}
                    gameData={gameData}
                    moderator={moderator}
                    cohortName={`${location.state.cohortName}_s${
                      parseInt(index) + location.state.plannedSessions + 1
                    }`}
                    defaultDate={location.state.startDate}
                  />
                  {index === location.state?.selectedNoOfSessions - 1 ? null : <hr />}
                </>
              ))}{' '}
            </div>
            <div className="create-curr4-submit">
              <button className="create-curr4-submit-btn" onClick={handleSubmit}>
                Save details
              </button>
              {/* {buttonError && <p className="button-error">{`⚠ Please select the session.`}</p>} */}
              {/* {selectError ? <p className="add-school-error">{`⚠ This input is required.`}</p> : <></>} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSession;
