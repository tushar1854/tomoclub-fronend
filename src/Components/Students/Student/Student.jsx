import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useNavigate, useLocation } from 'react-router-dom';

import './student.css';
import { useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const Student = () => {
  const navigate = useNavigate();
  let params = useParams();

  const [loader, setLoader] = useState(false);
  const [student, setStudent] = useState([]);

  const location = useLocation();
  const cohortUid = location.state?.cohortUid;
  console.log(cohortUid);

  // useEffect(() => {
  //   setLoader(true);
  //   callAPI(
  //     'get',
  //     `https://97z64a8oc5.execute-api.us-east-1.amazonaws.com/testing/student_full_info?studentusername=${params.student}`
  //   )
  //     .then((studentData) => {
  //       console.log(studentData);
  //       setStudent(studentData);
  //       setLoader(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoader(false);
  //     });
  // }, []);

  // return (
  //   <div className="hanna-container">
  //     <BreadcrumbsLink
  //       breadcrumbValues={{
  //         1: {
  //           name: 'Home',
  //           link: '/home'
  //         },
  //         2: {
  //           name: 'Students',
  //           link: '/students'
  //         }
  //       }}
  //       lastValue={params.student}
  //     />
  //     {loader ? (
  //       <Loader />
  //     ) : (
  //       <>
  //         <div className="hanna-basic">
  //           <h1>{`${student.firstName} ${student.lastName}`}</h1>
  //           <p>
  //             Student | {student.schoolName} | {student.grade}
  //           </p>
  //         </div>

  //         <div className="hanna-box">
  //           <div className="hanna-left">
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Student Id</h5>
  //                 <h6>{student.studentUsername}</h6>
  //               </div>
  //               <div className="hanna-left-data">
  //                 <h5>Cohorts</h5>
  //                 <h6>{student?.cohortName?.join(', ')}</h6>
  //               </div>
  //             </div>
  //             <hr />
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Date of birth</h5>
  //                 <h6>{student.dob}</h6>
  //               </div>
  //               <div className="hanna-left-data">
  //                 <h5>Age</h5>
  //                 <h6>{student.age}</h6>
  //               </div>
  //             </div>
  //             <hr />
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Date of joining</h5>
  //                 <h6>{student.createdAt?.split(' ')[0]}</h6>
  //               </div>
  //               <div className="hanna-left-data">
  //                 <h5>Preferred Language</h5>
  //                 <h6>English</h6>
  //               </div>
  //             </div>
  //             <hr />
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Ethnicity</h5>
  //                 <h6>{student.ethnicity}</h6>
  //               </div>
  //               <div className="hanna-left-data">
  //                 <h5>ELL</h5>
  //                 <h6>No Data</h6>
  //               </div>
  //             </div>
  //             <hr />
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Guardian name</h5>
  //                 <h6>{`${student.guardianFirstName} ${student.guardianLastName}`}</h6>
  //               </div>
  //               <div className="hanna-left-data">
  //                 <h5>Phone nuumber</h5>
  //                 <h6>{student.phoneNumber}</h6>
  //               </div>
  //             </div>
  //             <hr />
  //             <div className="hanna-row">
  //               <div className="hanna-left-data">
  //                 <h5>Student Email ID</h5>
  //                 <h6>{student.studentEmail}</h6>
  //                 <h5>Guardian Email ID</h5>
  //                 <h6>{student.guardianEmail}</h6>
  //               </div>
  //               <div className="hanna-left-data"></div>
  //             </div>
  //           </div>
  //           <div className="hanna-right">
  //             <button
  //               className="hanna-right-btn"
  //               onClick={() => {
  //                 navigate(`/students/session/${params.student}`, {
  //                   state: {
  //                     firstName: student.firstName,
  //                     lastName: student.lastName
  //                   }
  //                 });
  //               }}
  //             >
  //               View all session details
  //             </button>
  //             <div className="progress-student">
  //               <div className="student-progress-row">
  //                 <div className="hanna-progress">
  //                   <h3>Attendance</h3>
  //                   <CircularProgressbar
  //                     value={student.attendance}
  //                     className="hanna-circle"
  //                     text={`${student.attendance}%`}
  //                   />
  //                 </div>
  //                 <div className="hanna-progress">
  //                   <h3>Leadership</h3>
  //                   <CircularProgressbar
  //                     maxValue={5}
  //                     value={student.leadership}
  //                     className="hanna-circle"
  //                     text={student.leadership}
  //                   />
  //                 </div>
  //               </div>
  //               <div className="student-progress-row">
  //                 <div className="hanna-progress">
  //                   <h3>Innovation</h3>
  //                   <CircularProgressbar
  //                     maxValue={5}
  //                     value={student.innovation}
  //                     className="hanna-circle"
  //                     text={student.innovation}
  //                   />
  //                   {/* <studyProgress/> */}
  //                 </div>
  //                 <div className="hanna-progress">
  //                   <h3>Emotional Intelligence</h3>
  //                   <CircularProgressbar
  //                     maxValue={5}
  //                     value={student.emotionalIntelligence}
  //                     className="hanna-circle"
  //                     text={student.emotionalIntelligence}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );

  useEffect(() => {
    if (!cohortUid) return; // Avoid API call if cohortUid is missing
    setLoader(true);
    callAPI(
      'get',
      `https://m40u5swjrh.execute-api.us-east-1.amazonaws.com/testing/cohort_student_full_info?cohortuid=${cohortUid}&studentusername=${params.student}`
    )
      .then((studentData) => {
        console.log(studentData);
        setStudent(studentData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, [cohortUid, params.student]);

  return (
    <div className="hanna-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Students',
            link: '/students'
          }
        }}
        lastValue={params.student}
      />
      {loader ? (
        <Loader />
      ) : (
        <>
        <div className="hanna-box">
          <div className="hanna-left-box">
            <div className="hanna-basic">
              <h1>{`${student.firstName} ${student.lastName}`}</h1>
              <p>
                Student | {student.schoolName} | {student.grade}
              </p>
            </div>
            <div className="hanna-left">
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Student Id</h5>
                  <h6>{student.studentUsername}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Cohorts</h5>
                  <h6>{student?.cohortName}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Date of birth</h5>
                  <h6>{student.dob}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Age</h5>
                  <h6>{student.age}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Date of joining</h5>
                  <h6>{student.createdAt?.split(' ')[0]}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Preferred Language</h5>
                  <h6>English</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Ethnicity</h5>
                  <h6>{student.ethnicity}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>ELL</h5>
                  <h6>No Data</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Guardian name</h5>
                  <h6>{`${student.guardianFirstName} ${student.guardianLastName}`}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Phone number</h5>
                  <h6>{student.phoneNumber}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Student Email ID</h5>
                  <h6>{student.studentEmail}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Guardian Email ID</h5>
                  <h6>{student.guardianEmail}</h6>
                </div>
              </div>
            </div>
          </div>
            <div className="hanna-right">
              <button
                className="hanna-right-btn"
                onClick={() => {
                  navigate(`/students/session/${params.student}`, {
                    state: {
                      firstName: student.firstName,
                      lastName: student.lastName,
                      cohortUid: cohortUid
                    }
                  });
                }}
              >
                View all session details
              </button>
              <div className="progress-student">
                <div className="student-progress-row">
                  <div className="hanna-progress">
                    <h4>Attendance</h4>
                    {/* <CircularProgressbar
                      value={student.attendance}
                      className="hanna-circle"
                      text={`${student.attendance}%`}
                      styles={{
                        path: {
                          stroke: '#4c86e9',
                          strokeLinecap: 'round',
                          transition: 'stroke-dashoffset 0.5s ease 0s',
                        },
                        trail: {
                          stroke: '#d6d6d6',
                        },
                        text: {
                          fill: '#000',
                          fontSize: '16px',
                          fontWeight: '600',
                        },
                        background: {
                          fill: '#fff',
                        },
                      }}
                    /> */}
                    <div style={{ width: 120, height: 120, margin: '-10px 50px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        value={student.attendance}
                        text={`${student.attendance}%`}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="hanna-progress">
                    <h4>Sessions</h4>
                    {/* <CircularProgressbar
                      maxValue={5}
                      value={student.sessionCount}
                      className="hanna-circle"
                      text={student.sessionCount}
                    /> */}
                    <div style={{ width: 120, height: 120, margin: '-10px 15px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        maxValue={5}
                        value={student.sessionCount}
                        text={student.sessionCount}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="student-progress-row">
                  <div className="hanna-progress">
                    <h4>Pre-session</h4>
                    {/* <CircularProgressbar
                      maxValue={5}
                      value={student.preSessionRating}
                      className="hanna-circle"
                      text={student.preSessionRating}
                    /> */}
                    <div style={{ width: 120, height: 120, margin: '-10px 50px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        maxValue={5}
                        value={student.preSessionRating}
                        text={student.preSessionRating}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                    {/* <studyProgress/> */}
                  </div>
                  <div className="hanna-progress">
                    <h4>Post-session</h4>
                    {/* <CircularProgressbar
                      maxValue={5}
                      value={student.postSessionRating}
                      className="hanna-circle"
                      text={student.postSessionRating}
                    /> */}
                    <div style={{ width: 120, height: 120, margin: '-10px 15px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        maxValue={5}
                        value={student.postSessionRating}
                        text={student.postSessionRating}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="student-progress-row">
                  <div className="hanna-progress">
                    <h4>Student Mood</h4>
                    {/* <CircularProgressbar
                      maxValue={5}
                      value={student.mood}
                      className="hanna-circle"
                      text={student.mood}
                    /> */}                
                    <div style={{ width: 120, height: 120, margin: '-10px 50px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        maxValue={5}
                        value={student.mood}
                        text={student.mood}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="hanna-progress">
                    <h4>Correct Answers</h4>
                      {/* <CircularProgressbar
                        maxValue={5}
                        value={student.correctAnswerPercentage}
                        className="hanna-circle"
                        text={`${student.correctAnswerPercentage}%`}
                      /> */}
                    <div style={{ width: 120, height: 120, margin: '-10px 15px 30px 0px' }}>
                      <svg style={{ height: 0 }}>
                        <defs>
                          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4c86e9" />
                            <stop offset="100%" stopColor="#03e9c2" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <CircularProgressbar
                        maxValue={5}
                        value={student.correctAnswerPercentage}
                        text={`${student.correctAnswerPercentage}%`}
                        styles={{
                          path: {
                            stroke: 'url(#gradientStroke)',
                          },
                          trail: {
                            stroke: '#eee',
                          },
                          text: {
                            fill: '#000',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Student;
