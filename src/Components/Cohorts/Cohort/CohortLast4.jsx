import React, { useEffect, useState } from 'react';
import './cohort.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { callAPI } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
const TableHeader = ({ sessionInfoArr }) => {
  return (
    <div className="TableHeader-crafter-comp">
      <li>Student Name</li>
      <li>Attendance</li>
      {sessionInfoArr?.map((sessionInfo) => (
        <li key={sessionInfo.sessionid}>
          <li>{sessionInfo.sessionid}</li>
          <li>{sessionInfo.date}</li>
        </li>
      ))}
    </div>
  );
};
const TableData = ({ studentName, attendancePercentage, sessionInfoArr }) => {
  return (
    <div className="TableData-crafter-comp">
      <li>{studentName}</li>
      <li id={attendancePercentage === 100 ? 'crafter-present' : 'crafter-absent'}>
        {attendancePercentage}
      </li>
      {sessionInfoArr?.map((sessionInfo) => (
        <li key={sessionInfo.sessionid}>
          <li>{sessionInfo.gameName}</li>
          <li id={sessionInfo.present ? 'crafter-present' : 'crafter-absent'}>
            {sessionInfo.present ? 'Present' : 'Absent'}
          </li>
        </li>
      ))}
    </div>
  );
};
const CohortLast4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let params = useParams();
  const [loader, setLoader] = useState(false);
  const [cohortLast4Session, setCohortLast4Session] = useState([]);

  let cohortId = params.cohortUid;
  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://imdilzlr13.execute-api.us-east-1.amazonaws.com/testing/cohort-first-4-session?cohortid=${cohortId}`
    )
      .then((cohortAllData) => {
        console.log(cohortAllData);
        setCohortLast4Session(cohortAllData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, [cohortId]);
  console.log(cohortLast4Session);
  return (
    <div className="crafters-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Cohorts',
            link: '/cohorts'
          }
        }}
        lastValue={`${location.state.cohortName}`}
      />
      <div className="accounts-header">
        <h1>{location.state.cohortName}</h1>
      </div>
      <div className="session-head-desc">
        <div className="desc-column">
          <div className="left-desc">
            <p className="first-p">Teachers:</p> <p>{location.state.teachers}</p>
          </div>
          <div className="right-desc">
            <p className="first-p"> Cohort Timing:</p>{' '}
            <p>{`${location.state.day} ${location.state.time} ${location.state.timeZone}`}</p>
          </div>
        </div>
        <div className="desc-column">
          <div className="left-desc">
            <p className="first-p">Experts: </p>
            <p>{location.state.moderator}</p>
          </div>
          <div className="right-desc"></div>
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <>
          {cohortLast4Session && (
            <div className="crafters-table-container">
              <div className="crafters-table-header">
                <TableHeader sessionInfoArr={cohortLast4Session[0]?.sessionInfo} />
              </div>
              <div className="crafters-table-body">
                {cohortLast4Session?.map((cohortSession) => (
                  <TableData
                    key={cohortSession.name}
                    studentName={cohortSession.name}
                    attendancePercentage={cohortSession.attendancePercentage}
                    sessionInfoArr={cohortSession.sessionInfo}
                  />
                ))}
              </div>
            </div>
          )}
          <p
            className="cohort-single-view-all"
            onClick={() => navigate(`/cohorts/all/${cohortId}`)}
          >
            View all sessions
          </p>
        </>
      )}
    </div>
  );
};

export default CohortLast4;
