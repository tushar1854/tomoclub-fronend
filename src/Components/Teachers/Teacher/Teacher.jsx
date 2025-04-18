import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useNavigate } from 'react-router-dom';
import './teacher.css';
import { useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const teacher = () => {
  const navigate = useNavigate();
  let params = useParams();

  const [loader, setLoader] = useState(false);
  const [teacher, setteacher] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://97z64a8oc5.execute-api.us-east-1.amazonaws.com/testing/teacher_full_info?teacherusername=${params.teacher}`
    )
      .then((teacherData) => {
        console.log(teacherData);
        setteacher(teacherData);
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
            name: 'teachers',
            link: '/teachers'
          }
        }}
        lastValue={params.teacher}
      />
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="hanna-basic">
            <h1>{`${teacher.firstName} ${teacher.lastName}`}</h1>
            <p>
              teacher | {teacher.schoolName} | {teacher.grade}
            </p>
          </div>

          <div className="hanna-box">
            <div className="hanna-left">
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>teacher Id</h5>
                  <h6>{teacher.teacherUsername}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Cohorts</h5>
                  <h6>{teacher?.cohortName?.join(', ')}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Date of birth</h5>
                  <h6>{teacher.dob}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Age</h5>
                  <h6>{teacher.age}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Date of joining</h5>
                  <h6>{teacher.createdAt?.split(' ')[0]}</h6>
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
                  <h6>{teacher.ethnicity}</h6>
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
                  <h6>{`${teacher.guardianFirstName} ${teacher.guardianLastName}`}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Phone nuumber</h5>
                  <h6>{teacher.phoneNumber}</h6>
                </div>
              </div>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  {/* <h5>teacher Email ID</h5>
                  <h6>{teacher.teacherEmail}</h6> */}
                  <h5>Guardian Email ID</h5>
                  <h6>{teacher.guardianEmail}</h6>
                </div>
                <div className="hanna-left-data"></div>
              </div>
            </div>
            <div className="hanna-right">
              <button
                className="hanna-right-btn"
                onClick={() => {
                  navigate(`/teachers/session/${params.teacher}`, {
                    state: {
                      firstName: teacher.firstName,
                      lastName: teacher.lastName
                    }
                  });
                }}
              >
                View all session details
              </button>
              <div className="progress-teacher">
                <div className="teacher-progress-row">
                  <div className="hanna-progress">
                    <h3>Attendance</h3>
                    <CircularProgressbar
                      value={teacher.attendance}
                      className="hanna-circle"
                      text={`${teacher.attendance}%`}
                    />
                  </div>
                  <div className="hanna-progress">
                    <h3>Leadership</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={teacher.leadership}
                      className="hanna-circle"
                      text={teacher.leadership}
                    />
                  </div>
                </div>
                <div className="teacher-progress-row">
                  <div className="hanna-progress">
                    <h3>Innovation</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={teacher.innovation}
                      className="hanna-circle"
                      text={teacher.innovation}
                    />
                    {/* <studyProgress/> */}
                  </div>
                  <div className="hanna-progress">
                    <h3>Emotional Intelligence</h3>
                    <CircularProgressbar
                      maxValue={5}
                      value={teacher.emotionalIntelligence}
                      className="hanna-circle"
                      text={teacher.emotionalIntelligence}
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

export default teacher;
