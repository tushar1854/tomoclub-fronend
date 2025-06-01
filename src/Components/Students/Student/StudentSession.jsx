import React, { useEffect, useState } from 'react';

import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
// import edit from '../../assets/icons/edit.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';
// const user = JSON.parse(getSessionStorage('user'));
// const isTeacher = user?.entity === 'teacher';

// const TableHeader = () => {
//   return (
//     <div className="TableHeader-cohort-comp">
//       <li>Session ID</li>
//       <li>Experts</li>
//       <li>Date</li>
//       <li>Time</li>
//       <li>Status</li>
//       <li>Attendance</li>
//       <li>Evaluation</li>
//       {/* <li className="hidden"></li> */}
//     </div>
//   );
// };
// const TableData = ({
//   sessionUid,
//   teachers,
//   sessionDate,
//   time = '10:00 - 11:00 AM',
//   status,
//   attendance,
//   report,
//   studentId,
//   firstName,
//   lastName,
//   cohortName
// }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="TableData-cohort-comp">
//       <li
//         className="session-link-edit"
//         // onClick={() =>
//         //   navigate('/session/edit', {
//         //     state: {
//         //       session: session
//         //     }
//         //   })
//         // }
//       >
//         {sessionUid}
//       </li>
//       <li>{teachers}</li>
//       <li>{sessionDate}</li>
//       <li>{time}</li>
//       <li className={status === 'completed' ? 'view' : status === 'pending' ? 'pending' : 'live'}>
//         {capitalizeFirstChar(status)}
//       </li>
//       <li className={attendance === '0' ? 'pending' : 'view'}>
//         {attendance === '0' ? 'Pending' : 'View'}
//       </li>
//       <li
//         className={report === '0' ? 'pending' : 'view'}
//         onClick={() => {
//           navigate(`/students/eval/${studentId}`, {
//             state: {
//               firstName: firstName,
//               lastName: lastName,
//               sessionUid: sessionUid,
//               cohortName,
//               sessionDate,
//               status
//             }
//           });
//         }}
//       >
//         {report === '0' ? 'Pending' : 'View'}
//       </li>
//       {/* <li>
//         <img className="edit-img-cohort" src={edit} alt="edit" />
//       </li> */}
//     </div>
//   );
// };

// const cohortUid = location.state?.cohortUid;
// console.log('cohortUid', cohortUid);
  
const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      <li>Session ID</li>
      <li>Date</li>
      <li>Att</li>
      <li>Pre-Session</li>
      <li>Mood</li>
      <li>Post-Session</li>
      <li>Correct Answers</li>
      <li>Game Rating</li>
    </div>
  );
};
const TableData = ({
  sessionId,
  date,
  attendance,
  preSessionRating,
  mood,
  postSessionRating,
  gameRating,
  correctAnswerCount
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cohortUid = location.state?.cohortUid;
  const params = useParams();
  return (
    <div className="TableData-cohort-comp">
      <li className='session-link-edit' 
        onClick={() =>
          navigate('/session/edit/editStudentFeedback', {
            state: {
              sessionId: sessionId,
              cohortUid: cohortUid,
              studentUsername: params.student,
            }
          })
        }>{sessionId}</li>
      <li>{date}</li>
      <li className={attendance ? 'text-green-500' : 'text-red-600'}>
        {attendance ? 'P' : 'A'}
      </li>
      <li>{preSessionRating || '-'}</li>
      <li>{mood || '-'}</li>
      <li>{postSessionRating || '-'}</li>
      <li>{correctAnswerCount || '-'}</li>
      <li>{gameRating || '-'}</li>

      {/* ✅ Move this here so it knows which session to open */}
      
    </div>
  );
};

const StudentSession = () => {
  let params = useParams();
  let location = useLocation();
  let navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [studentSess, setStudentSession] = useState([]);
  const cohortUid = location.state?.cohortUid;
  const [sessionId,setSessionId] = useState();
  console.log('sessionId', sessionId);

  // useEffect(() => {
  //   setLoader(true);
  //   callAPI(
  //     'get',
  //     `https://94maxh9api.execute-api.us-east-1.amazonaws.com/testing/get_session_for_students?studentusername=${params.student}`
  //   )
  //     .then((studentSession) => {
  //       console.log(studentSession);
  //       setStudentSession(studentSession);
  //       setLoader(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoader(false);
  //     });
  // }, []);

  // return (
  //   <div className="cohorts-container">
  //     <BreadcrumbsLink
  //       breadcrumbValues={{
  //         1: {
  //           name: 'Home',
  //           link: '/home'
  //         },
  //         2: {
  //           name: 'Students',
  //           link: '/students'
  //         },
  //         3: {
  //           name: 'Session',
  //           link: '/session'
  //         }
  //       }}
  //       lastValue={params.student}
  //     />
  //     <div className="accounts-header">
  //       <h1>{`${location.state.firstName} ${location.state.lastName}`}</h1>
  //     </div>
  //     {loader ? (
  //       <Loader />
  //     ) : (
  //       <>
  //         <div className="session-head-desc">
  //           <div className="desc-column">
  //             <div className="left-desc">
  //               <p className="first-p">Teachers:</p> <p>{studentSess[0]?.teachers}</p>
  //               {/* <p>{location.state?.session?.cohortUid}</p> */}
  //             </div>
  //           </div>
  //           <div className="desc-column">
  //             <div className="left-desc">
  //               <p className="first-p">Experts:</p> <p>{studentSess[0]?.sessionModerator}</p>
  //               {/* <p>{location.state?.session?.sessionId}</p> */}
  //             </div>
  //           </div>
  //         </div>
  //         <div className="cohort-table-container-1">
  //           <div className="cohort-table-header">
  //             <TableHeader />
  //           </div>
  //           <div className="student-table-body">
  //             {studentSess.map((session) => (
  //               <TableData
  //                 key={session.sessionId}
  //                 sessionUid={session.sessionId}
  //                 teachers={session.sessionModerator}
  //                 sessionDate={session.sessionDate}
  //                 time={session.sessionTime + ' ' + session.timeZone}
  //                 status={session.status}
  //                 attendance={session.attendance}
  //                 report={session.evaluation}
  //                 studentId={params.student}
  //                 firstName={location.state.firstName}
  //                 lastName={location.state.lastName}
  //                 cohortName={session.cohortName}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://5kud0o2sy6.execute-api.us-east-1.amazonaws.com/testing/cohort_session_info_for_particular_student?studentusername=${params.student}&cohortuid=${cohortUid}`
    )
      .then((studentSession) => {
        console.log(studentSession);
        setStudentSession(studentSession);
        setSessionId(studentSession[0]?.sessionId);
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
                <p className="first-p">Teachers:</p> <p className='font-normal'>{studentSess[0]?.teachers
                  ?.split(',')
                  .map(t => t.trim().split(' (')[0])
                  .join(' | ')
                }</p>
                {/* <p>{location.state?.session?.cohortUid}</p> */}
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
                  sessionId={session.sessionId}
                  date={session.date}
                  attendance={session.attendance}
                  preSessionRating={session.preSessionRating}
                  mood={session.mood}
                  postSessionRating={session.postSessionRating}
                  correctAnswerCount={session.correctAnswerCount}
                  gameRating={session.gameRating}
                />
              ))}
            </div>
          </div>
          <div className='absolute text-blue-800 underline cursor-pointer right-7'
              onClick={() =>
                navigate('/session/edit/editStudentFeedback', {
                  state: {
                    sessionId: sessionId,
                    cohortUid: cohortUid,
                    studentUsername: '',
                  }
                })
              }

          > View Feedback Forms </div>
        </>
      )}
    </div>
  );
};

export default StudentSession;
