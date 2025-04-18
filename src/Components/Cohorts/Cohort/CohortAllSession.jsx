import React, { useEffect, useState } from 'react';

import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
// import edit from '../../assets/icons/edit.svg';
import { useNavigate, useParams } from 'react-router-dom';
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
        }
      >
        {sessionUid}
      </li>
      <li>{teachers}</li>
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
        }
      >
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
        }
      >
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
        }
      >
        {report === '0' ? 'Pending' : 'View'}
      </li>
      {/* <li>
        <img className="edit-img-cohort" src={edit} alt="edit" />
      </li> */}
    </div>
  );
};
const CohortAllSession = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [loader, setLoader] = useState(false);
  const [cohortSessionAll, setCohortSessionAll] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read?cohortid=${params.cohortUid}`
    )
      .then((cohortSessionAllData) => {
        console.log(cohortSessionAllData);
        setCohortSessionAll(cohortSessionAllData);
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
            name: 'Cohorts',
            link: '/cohorts'
          }
        }}
        lastValue={cohortSessionAll[0]?.cohortName ? cohortSessionAll[0]?.cohortName : ''}
      />
      <div className="accounts-header">
        <h1>{cohortSessionAll[0]?.cohortName}</h1>
      </div>
      <div className="session-head-desc">
        <div className="desc-column">
          <div className="left-desc">
            <p className="first-p">Teachers:</p> <p>{cohortSessionAll[0]?.teachers}</p>
          </div>
          <div className="right-desc">
            <p className="first-p"> Cohort Timing:</p>{' '}
            <p>
              {cohortSessionAll[0]?.cohortName
                ? `${cohortSessionAll[0]?.day} ${cohortSessionAll[0]?.cohortTime} ${cohortSessionAll[0]?.timeZone}`
                : ''}
            </p>
          </div>
        </div>
        <div className="desc-column">
          <div className="left-desc">
            <p className="first-p">Experts: </p>
            <p> {cohortSessionAll[0]?.sessionModerator}</p>
          </div>
          <div className="right-desc"></div>
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div className="cohort-table-container-1">
          <div className="cohort-table-header">
            <TableHeader />
          </div>
          <div className="student-table-body">
            {cohortSessionAll?.map((cohortSession) => (
              <TableData
                key={cohortSession.sessionId}
                sessionUid={cohortSession.sessionId}
                onClick={() => navigate('/')}
                teachers={cohortSession.sessionModerator}
                sessionDate={cohortSession.date}
                time={cohortSession.sessionTime + ' ' + cohortSession.timeZone}
                status={cohortSession.status}
                attendance={cohortSession.attendance_status}
                report={cohortSession.evaluation_status} // evaluation_status
                session={cohortSession}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CohortAllSession;
