import React, { useEffect, useState } from 'react';
import './editCurriculum.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
// import MultipleSelect from '../Common/MultipleSelect/MultipleSelect';

// import AccordianSelect from '../Common/Acordian-Select/AccordianSelect';
// import InputField from '../Common/InputField/InputField';
import { useLocation, useNavigate } from 'react-router-dom';
import { callAPI } from '../../Helper';
import Loader from '../Common/Loader/Loader';
import EditAccordian from '../Common/EditAccordian/EditAccordian';
function EditCurriculum() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [addSession, setAddSession] = useState(0);
  const [curriculumData, setCurriculumData] = useState({});

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://katmi7pdeb.execute-api.us-east-1.amazonaws.com/testing/curriculumsessionread?curriculumUid=${location.state.curriculumUid}`
    )
      .then((curriculumAllData) => {
        console.log(curriculumAllData);
        setCurriculumData({ ...curriculumAllData });
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

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

      {/* //form */}
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
                  <p>{location.state.nameOfPreset}</p>
                </div>
              </div>
            </div>
            <hr />
            {curriculumData?.sessions?.map((session, index) => (
              <>
                <EditAccordian
                  key={index}
                  name={`Session ${parseInt(index) + 1} details`}
                  gameName={session.gameName}
                  gameMode={session.gameMode}
                  gameObjectives={session.skillToFocus}
                />
                {index === location.state?.noOfSessions - 1 ? null : <hr />}
              </>
            ))}
          </div>
          <div className="curr5-edit-form">
            <div className="curr5-edit-form-left">
              <h4>+ Add more sessions to this preset</h4>
            </div>
            <div className="curr5-edit-form-right">
              <div className="curr5-edit-h4">
                <h4>How many new sessions you wish to add this curriculum preset?</h4>
              </div>
              <div className="curr5-input">
                <input
                  type="text"
                  value={addSession}
                  onChange={(e) => setAddSession(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="create-curr4-submit">
            <button
              className="create-curr4-submit-btn"
              onClick={() =>
                navigate('/curriculum/edit/addsession', {
                  state: {
                    addNewSession: addSession,
                    nameOfPreset: location.state.nameOfPreset,
                    noOfSessions: location.state.noOfSessions,
                    sessions: curriculumData?.sessions
                  }
                })
              }>
              Save this preset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EditCurriculum;
