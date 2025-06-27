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

const StudentTableHeader = () => (
  <div className="TableHeader-cohort-comp">
    <li>Session ID</li>
    <li>Date</li>
    <li>Time</li>
    <li>Status</li>
    <li>Attendance</li>
    <li>Report</li>
  </div>
);

const StudentTableData = ({ session }) => {
  const navigate = useNavigate();
  const {
    sessionId,
    date,
    sessionTime,
    sessionEndTime,
    timeZone,
    status,
    attendance_status,
    evaluation_status,
    isStarted,
    cohortUid
  } = session;

  const [hasJoined, setHasJoined] = useState(false);
  const user = JSON.parse(getSessionStorage('user'));
  const studentUsername = user?.studentusernameprimarykey;

  const handleJoin = async () => {
    try {
      await callAPI('post', 'https://2dirkqld1f.execute-api.us-east-1.amazonaws.com/testing/student-attendance', {
        studentusername: studentUsername,
        present: true,
        sessionid: sessionId,
        cohortuid: cohortUid,
      });
      setHasJoined(true);
      if (session.url) {
        window.open(session.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const capitalizeFirstChar = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

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
        {sessionId}
      </li>
      <li>{date}</li>
      <li>{sessionTime + ' - ' + sessionEndTime + ' ' + timeZone}</li>
      <li className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}>
        {isStarted && !hasJoined ? (
          <button className="start-btn" onClick={handleJoin}>
            Join
          </button>
        ) : hasJoined ? (
          'Joined'
        ) : (
          capitalizeFirstChar(status)
        )}
      </li>
      <li className={attendance_status === '0' ? 'pending' : 'view'}>
        {attendance_status === '0' ? 'Pending' : 'View'}
      </li>
      <li className={evaluation_status === '0' ? 'pending' : 'view'}>
        {evaluation_status === '0' ? 'Pending' : 'View'}
      </li>
    </div>
  );
};
// const TeacherTableData = ({ session }) => {
//   const navigate = useNavigate();
//   const {
//     sessionId,
//     date,
//     sessionTime,
//     sessionEndTime,
//     timeZone,
//     status,
//     isStarted,
//     showButton,
//     attendancePercentage,
//     avgSessionRating,
//   } = session;

//   const [tempStartedSessions, setTempStartedSessions] = useState({});

//   const handleStart = async (sessionId) => {
//     try {
//       // API call to start the session
//       await callAPI('post', 'https://9x3cu0xdr0.execute-api.us-east-1.amazonaws.com/testing/session-start-stop-button', {
//         sessionid: sessionId,
//       });

//       // Update temp state
//       setTempStartedSessions((prev) => ({ ...prev, [sessionId]: true }));

//       console.log(`Starting session: ${sessionId}`);
//     } catch (error) {
//       console.error('Error starting session:', error);
//     }
//   };

//   const handleStop = async (sessionId) => {
//     try {
//       // API call to start the session
//       await callAPI('post', 'https://9x3cu0xdr0.execute-api.us-east-1.amazonaws.com/testing/session-start-stop-button', {
//         sessionid: sessionId,
//       });      

//       console.log(`Stopping session: ${sessionId}`);
//       window.location.reload();
//     } catch (error) {
//       console.error('Error stopping session:', error);
//     }
//   };
//   return (
//     <div className="TableData-cohort-comp">
//       <li
//         className="session-link-edit"
//         onClick={() =>
//           navigate('/session/edit', {
//             state: { session }
//           })
//         }
//       >
//         {sessionId}
//       </li>
//       <li>{date}</li>
//       <li>{sessionTime + ' - ' + sessionEndTime + ' ' + timeZone}</li>
//       <li className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}>
//         {capitalizeFirstChar(status)}
//       </li>
//       <li>
//         {showButton ? (
//           tempStartedSessions[sessionId] || isStarted ? (
//             <button className="stop-btn" onClick={() => handleStop(sessionId)}>
//               Stop
//             </button>
//           ) : (
//             <button className="start-btn" onClick={() => handleStart(sessionId)}>
//               Start
//             </button>
//           )
//         ) : null}
//       </li>

//       <li className={(tempStartedSessions[sessionId]||isStarted) ? 'pending' : 'view'}>
//         {isStarted ? 'Pending' : `${attendancePercentage}`}
//       </li>
//       <li className={(tempStartedSessions[sessionId]||isStarted) ? 'pending' : 'view'}>
//         {isStarted ? 'Pending' : avgSessionRating || '-'}
//       </li>
//     </div>
//   );
// };


const TeacherTableHeader = () => (
  <div className="TableHeader-cohort-comp">
    <li>Session ID</li>
    <li>Date</li>
    <li>Time</li>
    <li>Status</li>
    <li>Action</li>
    <li>Attendance</li>
    <li>Session Rating</li>
  </div>
);

const TeacherTableData = ({ session }) => {
  const navigate = useNavigate();
  const {
    sessionId,
    date,
    sessionTime,
    sessionEndTime,
    timeZone,
    status,
    isStarted,
    showButton,
    attendancePercentage,
    avgSessionRating,
    url
  } = session;

  const [tempStartedSessions, setTempStartedSessions] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [sessionUrl, setSessionUrl] = useState('');

  const handleSubmit = async () => {
    try {
      await callAPI('post', 'https://9x3cu0xdr0.execute-api.us-east-1.amazonaws.com/testing/session-start-stop-button', {
        sessionid: sessionId,
        url: sessionUrl
      });
      setTempStartedSessions((prev) => ({ ...prev, [sessionId]: true }));
      setShowPopup(false);
      setSessionUrl('');
      window.location.reload();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleStop = async () => {
    try {
      await callAPI('post', 'https://9x3cu0xdr0.execute-api.us-east-1.amazonaws.com/testing/session-start-stop-button', {
        sessionid: sessionId,
        url: sessionUrl
      });
      console.log(`Stopping session: ${sessionId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  const handleJoin = () => {
    if (url) window.open(url, '_blank');
  };

  return (
    <>
      <div className="TableData-cohort-comp">
        <li
          className="session-link-edit"
          onClick={() =>
            navigate('/session/edit', {
              state: { session }
            })
          }
        >
          {sessionId}
        </li>
        <li>{date}</li>
        <li>{`${sessionTime} - ${sessionEndTime} ${timeZone}`}</li>
        <li className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}>
          {capitalizeFirstChar(status)}
        </li>
        <li>
          {showButton ? (
            tempStartedSessions[sessionId] || isStarted ? (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="start-btn" onClick={handleJoin}>Join</button>
                <button className="stop-btn" onClick={handleStop}>Stop</button>
              </div>
            ) : (
              <button className="start-btn" onClick={() => setShowPopup(true)}>
                Start
              </button>
            )
          ) : null}
        </li>
        <li className={(tempStartedSessions[sessionId] || isStarted) ? 'pending' : 'view'}>
          {isStarted ? 'Pending' : `${attendancePercentage}`}
        </li>
        <li className={(tempStartedSessions[sessionId] || isStarted) ? 'pending' : 'view'}>
          {isStarted ? 'Pending' : avgSessionRating || '-'}
        </li>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <label htmlFor="sessionUrl"><strong>Enter the session URL:</strong></label>
            <input
              id="sessionUrl"
              type="text"
              value={sessionUrl}
              onChange={(e) => setSessionUrl(e.target.value)}
              placeholder="https://..."
              className="popup-input"
            />
            <div className="popup-actions">
              <button className="popup-submit" onClick={handleSubmit}>Submit</button>
              <button className="popup-cancel" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
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
    if (user?.entity === 'student') {
      callAPI(
        'get',
        `https://r9vo37kodl.execute-api.us-east-1.amazonaws.com/testing/student_session_data?student_username=${user?.studentusernameprimarykey}`
      )
        .then((sessionData) => {
          console.log(sessionData);
          setSessionAll(sessionData);
          setLoader(false);
        })
        .catch((err) => {
          console.error(err);
          setLoader(false);
        });
      return;
    }

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
        `https://qalb91pdu7.execute-api.us-east-1.amazonaws.com/testing/cohort-teacher-read?teacheremail=${user?.emailId}`
      )
        .then((cohortAll) => {
          console.log(cohortAll);
          const uniqueCohorts = cohortAll.filter(
            (cohort, index, self) =>
              index === self.findIndex((c) => c.cohortUid === cohort.cohortUid)
          );
          setCohortList(uniqueCohorts);
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
      } else if (user?.entity === 'teacher') {
        callAPI(
          'get',
          `https://zzpq0vmz17.execute-api.us-east-1.amazonaws.com/testing/session-teacher?teacheruid=${user?.uid}&cohortid=${cohortUid}`
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
       else {
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
      <BreadcrumbsLink breadcrumbValues={{ 1: { name: 'Home', link: '/home' } }} lastValue={'Sessions'} />
      <div className="accounts-header">
        <h1>Sessions</h1>
        {user?.entity !== 'student' && (
          <div className="cohort-top-btn btn-session">
            {user?.entity !== 'moderator' && user?.entity !== 'teacher' && (
              <>
                <button className="create-cohort-btn" onClick={() => navigate('/session/generate')}>
                  + Generate Sessions
                </button>
                <button className="create-cohort-btn" onClick={() => navigate('/session/singlesession')}>
                  + Add a Sessions
                </button>
              </>
            )}
            {user?.entity !== 'teacher' && (
              <>
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
              </>
            )}
            {user?.entity === 'teacher' && (
              <div className="ses-stu-dr-2">
                <span>Filter sessions by Cohort:</span>
                <SelectInputFieldMod
                  options={cohortList}
                  selectData={(dataValue) => setSelectValue({ ...selectValue, cohort: dataValue })}
                  select={selectValue.cohort}
                  providedList={'cohort'}
                />
                <button onClick={() => window.location.reload()} className="pl-2 pr-2 mt-1 text-lg font-bold border-collapse border-none bg-slate-150 h-9">
                  ↻
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div className="cohort-table-container-1">
          <div className="cohort-table-header">
            {user?.entity === 'student' ? (
              <StudentTableHeader />
            ) : user?.entity === 'teacher' ? (
              <TeacherTableHeader />
            ) : (
              <TableHeader />
            )}
          </div>
          <div className="student-table-body">
            {sessionAll?.map((session) => {
              if (user?.entity === 'student') {
                return <StudentTableData key={session.sessionId} session={session} />;
              } else if (user?.entity === 'teacher') {
                return (
                  <TeacherTableData
                    key={session.sessionId}
                    session={session}
                  />
                );
              } else {
                return (
                  <TableData
                    key={session.sessionId}
                    sessionUid={session.sessionId}
                    teachers={session.sessionModerator}
                    sessionDate={session.date}
                    time={`${session.sessionTime} - ${session.sessionEndTime} ${session.timeZone}`}
                    status={session.status}
                    attendance={session.attendance_status}
                    report={session.evaluation_status}
                    session={session}
                  />
                );
              }
            })}
          </div>
        </div>

      )}
    </div>
  );
};

export default Session;
