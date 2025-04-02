import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useNavigate } from 'react-router-dom';
import './student.css';
import { useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const Student = () => {
  const navigate = useNavigate();
  let params = useParams();

  const [loader, setLoader] = useState(false);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://97z64a8oc5.execute-api.us-east-1.amazonaws.com/testing/student_full_info?studentusername=${params.student}`
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
  }, []);

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
          <div className="hanna-basic">
            <h1>{`${student.firstName} ${student.lastName}`}</h1>
            <p>
              Student | {student.schoolName} | {student.grade}
            </p>
          </div>

          <div className="hanna-box">
            <div className="hanna-left">
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Student Id</h5>
                  <h6>{student.studentUsername}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Cohorts</h5>
                  <h6>{student?.cohortName?.join(', ')}</h6>
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
                  <h5>Phone nuumber</h5>
                  <h6>{student.phoneNumber}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  {/* <h5>Student Email ID</h5>
                  <h6>{student.studentEmail}</h6> */}
                  <h5>Guardian Email ID</h5>
                  <h6>{student.guardianEmail}</h6>
                </div>
                <div className="hanna-left-data"></div>
              </div>
            </div>
            <div className="hanna-right">
              <button
                className="hanna-right-btn"
                onClick={() => {
                  navigate(`/students/session/${params.student}`, {
                    state: {
                      firstName: student.firstName,
                      lastName: student.lastName
                    }
                  });
                }}>
                View all session details
              </button>
              <div className="progress-student">
                <div className="student-progress-row">
                  <div className="hanna-progress">
                    <h3>Attendance</h3>
                    <CircularProgressbar
                      value={student.attendance}
                      className="hanna-circle"
                      text={`${student.attendance}%`}
                    />
                  </div>
                  <div className="hanna-progress">
                    <h3>Leadership</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={student.leadership}
                      className="hanna-circle"
                      text={student.leadership}
                    />
                  </div>
                </div>
                <div className="student-progress-row">
                  <div className="hanna-progress">
                    <h3>Innovation</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={student.innovation}
                      className="hanna-circle"
                      text={student.innovation}
                    />
                    {/* <studyProgress/> */}
                  </div>
                  <div className="hanna-progress">
                    <h3>Emotional Intelligence</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={student.emotionalIntelligence}
                      className="hanna-circle"
                      text={student.emotionalIntelligence}
                    />
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
