'use client';

import { useEffect, useState } from 'react';

import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
// import edit from '../../assets/icons/edit.svg';
import { useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader/Loader';
import { callAPI, capitalizeFirstChar, getSessionStorage } from '../../Helper';
import SelectInputFieldMod from '../Common/SelectInputFieldMod/SelectInputFieldMod';

const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      {/* //       <div className="bg-pink-200 text-xl font-semibold p-4 rounded-md">
//   Tailwind is finally working! 🎉
// </div> */}

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
  time = '',
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
        <img className="edit-img-cohort" src={edit || "/placeholder.svg"} alt="edit" />
      </li> */}
    </div>
  );
};
const Session = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [sessionAll, setSessionAll] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectValue, setSelectValue] = useState({});

  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setLoader(true);
    if (user?.entity === 'moderator') {
      callAPI(
        'get',
        `https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read?moderatoruid=${user?.uid}`
      )
        .then((sessionAllData) => {
          console.log(sessionAllData);
          setSessionAll(sessionAllData);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
      callAPI(
        'get',
        `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read?moderatoruid=${user?.uid}`
      )
        .then((cohortAll) => {
          console.log(cohortAll);
          setCohortList(cohortAll);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } else if (user?.entity === 'teacher') {
      callAPI(
        'get',
        `https://zzpq0vmz17.execute-api.us-east-1.amazonaws.com/testing/session-teacher?teacheruid=${user?.uid}`
      )
        .then((sessionAllData) => {
          console.log(sessionAllData);
          setSessionAll(sessionAllData);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
      callAPI(
        'get',
        `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read?moderatoruid=${user?.uid}`
      )
        .then((cohortAll) => {
          console.log(cohortAll);
          setCohortList(cohortAll);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } else {
      callAPI('get', 'https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read')
        .then((sessionAllData) => {
          console.log(sessionAllData);
          setSessionAll(sessionAllData);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
      callAPI('get', 'https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read')
        .then((cohortAll) => {
          console.log(cohortAll);
          setCohortList(cohortAll);
          // setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    }
    callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
      .then((schoolAll) => {
        console.log(schoolAll);
        setSchoolList(schoolAll);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    if (selectValue?.cohort?.cohortUid || selectValue?.school) {
      const cohortUid = selectValue?.cohort?.cohortUid || '';
      const schoolName = selectValue?.school || '';
      setLoader(true);
      if (user?.entity === 'moderator') {
        callAPI(
          'get',
          `https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read?moderatoruid=${user?.uid}&cohortid=${cohortUid}&schoolname=${schoolName}`
        )
          .then((sessionAllData) => {
            console.log(sessionAllData);
            setSessionAll(sessionAllData);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);
          });
      } else {
        callAPI(
          'get',
          `https://93t8sqirr6.execute-api.us-east-1.amazonaws.com/testing/session-read?cohortid=${cohortUid}&schoolname=${schoolName}`
        )
          .then((sessionAllData) => {
            console.log(sessionAllData);
            setSessionAll(sessionAllData);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);
          });
      }
    }
  }, [selectValue]);

  return (
    <div className="cohorts-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Sessions'}
      />
      <div className="accounts-header">
        <h1>Sessions</h1>
        <div className="cohort-top-btn btn-session">
          {user?.entity === 'moderator' || user?.entity === 'teacher' ? null : (
            <>
              <button className="create-cohort-btn" onClick={() => navigate('/session/generate')}>
                + Generate Sessions
              </button>
              <button
                className="create-cohort-btn"
                onClick={() => navigate('/session/singlesession')}
              >
                + Add a Sessions
              </button>
            </>
          )}
          <div className="ses-stu-dr-1">
            <p>Filter School</p>
            <SelectInputFieldMod
              options={schoolList}
              selectData={(dataValue) => setSelectValue({ ...selectValue, school: dataValue })}
              select={selectValue.school}
              providedList="school"
            />
          </div>
          <div className="ses-stu-dr-1">
            <p>Filter Cohort</p>
            <SelectInputFieldMod
              options={cohortList}
              selectData={(dataValue) => setSelectValue({ ...selectValue, cohort: dataValue })}
              select={selectValue.cohort}
              providedList={'cohort'}
            />
          </div>
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
            {sessionAll &&
              sessionAll?.map((session) => (
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
  );
};

export default Session;
