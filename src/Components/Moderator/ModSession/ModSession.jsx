import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { callAPI, capitalizeFirstChar } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';

const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      <li>Session Id</li>
      <li>Date</li>
      <li>Time</li>
      <li>Status</li>
      <li>Attendance</li>
      <li>Evaluation</li>
    </div>
  );
};
const TableData = ({
  sessionUid,
  sessionDate,
  time = '10:00 - 11:00 AM',
  status,
  attendance,
  report,
  session
}) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-cohort-comp">
      <li
        className="session-link-edit"
        onClick={() =>
          navigate('/session/edit', {
            state: {
              session: session
            }
          })
        }>
        {sessionUid}
      </li>
      <li>{sessionDate}</li>
      <li>{time}</li>
      <li
        className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}
        onClick={() =>
          navigate('/session/edit', {
            state: {
              session: session
            }
          })
        }>
        {capitalizeFirstChar(status)}
      </li>
      <li
        className={attendance === '0' ? 'pending' : 'view'}
        onClick={() =>
          navigate('/session/edit', {
            state: {
              session: session
            }
          })
        }>
        {attendance === '0' ? 'Pending' : 'View'}
      </li>
      <li
        className={report === '0' ? 'pending' : 'view'}
        onClick={() =>
          navigate('/session/edit', {
            state: {
              session: session
            }
          })
        }>
        {report === '0' ? 'Pending' : 'View'}
      </li>
      {/* <li>
        <img className="edit-img-cohort" src={edit} alt="edit" />
      </li> */}
    </div>
  );
};

const ModSession = () => {
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [modSession, setModSession] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read?moderatoruid=${location.state.modId}`
    )
      .then((modSess) => {
        console.log(modSess);
        setModSession(modSess);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  return (
    <div>
      <div className="students-container">
        <BreadcrumbsLink
          breadcrumbValues={{
            1: {
              name: 'Home',
              link: '/home'
            }
          }}
          lastValue={'Experts'}
        />
        <div className="accounts-header">
          <div className="add-school-input-box">
            <h1>{location.state.name}</h1>
            <p className="grey-p">Experts</p>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <div className="sam-ses-table-container">
            <div className="cohort-table-header">
              <TableHeader />
            </div>
            <div className="student-table-body">
              {modSession.map((session) => (
                <TableData
                  key={session.sessionId}
                  sessionUid={session.sessionId}
                  teachers={session.sessionModerator}
                  sessionDate={session.date}
                  time={session.sessionTime + ' ' + session.timeZone}
                  status={session.status}
                  attendance={session.attendance_status}
                  report={session.evaluation_status}
                  session={session}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModSession;
