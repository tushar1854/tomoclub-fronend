import React, { useEffect, useState } from 'react';

import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
// import edit from '../../assets/icons/edit.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI, capitalizeFirstChar } from '../../../Helper';

const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      <li>Session ID</li>
      <li>Experts</li>
      <li>Date</li>
      <li>Time</li>
      <li>Status</li>
      <li>Attendance</li>
      <li>Evaluation</li>
      {/* <li className="hidden"></li> */}
    </div>
  );
};
const TableData = ({
  sessionUid,
  teachers,
  sessionDate,
  time = '10:00 - 11:00 AM',
  status,
  attendance,
  report,
  studentId,
  firstName,
  lastName,
  cohortName
}) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-cohort-comp">
      <li
        className="session-link-edit"
        // onClick={() =>
        //   navigate('/session/edit', {
        //     state: {
        //       session: session
        //     }
        //   })
        // }
      >
        {sessionUid}
      </li>
      <li>{teachers}</li>
      <li>{sessionDate}</li>
      <li>{time}</li>
      <li className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}>
        {capitalizeFirstChar(status)}
      </li>
      <li className={attendance === '0' ? 'pending' : 'view'}>
        {attendance === '0' ? 'Pending' : 'View'}
      </li>
      <li
        className={report === '0' ? 'pending' : 'view'}
        onClick={() => {
          navigate(`/students/eval/${studentId}`, {
            state: {
              firstName: firstName,
              lastName: lastName,
              sessionUid: sessionUid,
              cohortName,
              sessionDate,
              status
            }
          });
        }}>
        {report === '0' ? 'Pending' : 'View'}
      </li>
      {/* <li>
        <img className="edit-img-cohort" src={edit} alt="edit" />
      </li> */}
    </div>
  );
};
const StudentSession = () => {
  let params = useParams();
  let location = useLocation();
  const [loader, setLoader] = useState(false);
  const [studentSess, setStudentSession] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://94maxh9api.execute-api.us-east-1.amazonaws.com/testing/get_session_for_students?studentusername=${params.student}`
    )
      .then((studentSession) => {
        console.log(studentSession);
        setStudentSession(studentSession);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  return (
    <div className="cohorts-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Students',
            link: '/students'
          },
          3: {
            name: 'Session',
            link: '/session'
          }
        }}
        lastValue={params.student}
      />
      <div className="accounts-header">
        <h1>{`${location.state.firstName} ${location.state.lastName}`}</h1>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="session-head-desc">
            <div className="desc-column">
              <div className="left-desc">
                <p className="first-p">Teachers:</p> <p>{studentSess[0]?.teachers}</p>
                {/* <p>{location.state?.session?.cohortUid}</p> */}
              </div>
            </div>
            <div className="desc-column">
              <div className="left-desc">
                <p className="first-p">Experts:</p> <p>{studentSess[0]?.sessionModerator}</p>
                {/* <p>{location.state?.session?.sessionId}</p> */}
              </div>
            </div>
          </div>
          <div className="cohort-table-container-1">
            <div className="cohort-table-header">
              <TableHeader />
            </div>
            <div className="student-table-body">
              {studentSess.map((session) => (
                <TableData
                  key={session.sessionId}
                  sessionUid={session.sessionId}
                  teachers={session.sessionModerator}
                  sessionDate={session.sessionDate}
                  time={session.sessionTime + ' ' + session.timeZone}
                  status={session.status}
                  attendance={session.attendance}
                  report={session.evaluation}
                  studentId={params.student}
                  firstName={location.state.firstName}
                  lastName={location.state.lastName}
                  cohortName={session.cohortName}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentSession;
