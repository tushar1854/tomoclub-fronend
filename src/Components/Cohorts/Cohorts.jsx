import React, { useEffect, useState } from 'react';
import './cohorts.css';
import { useNavigate } from 'react-router-dom';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import Loader from '../Common/Loader/Loader';
import edit from '../../assets/icons/edit.svg';
import { callAPI, capitalizeFirstChar, getSessionStorage } from '../../Helper';
import SelectInputFieldMod from '../Common/SelectInputFieldMod/SelectInputFieldMod';
import TeacherCohorts from './TeacherCohorts'; // adjust path as needed

const TableHeader = () => {
  const user = JSON.parse(getSessionStorage('user'));
  const isTeacher = user?.entity === 'teacher';

  return (
    <div className="TableHeader-cohort-comp">
      {isTeacher ? (
        <>
          <li>Date Created</li>
          <li>Cohort Name</li>
          <li>No. of Students</li>
          <li>Sessions</li>
        </>
      ) : (
        <>
          <li>Cohort ID</li>
          <li>Cohort Name</li>
          <li>No. of students</li>
          <li>Planned Sessions</li>
          <li>Completed Sessions</li>
          <li>Date created</li>
          <li className="hidden"></li>
        </>
      )}
    </div>
  );
};

const TableData = ({
  cohortUid,
  createdAt,
  cohortName,
  plannedSessions,
  completedSessions,
  numberOfStudent,
  noOfSessions,
  cohort
}) => {
  const user = JSON.parse(getSessionStorage('user'));
  const isTeacher = user?.entity === 'teacher';
  const navigate = useNavigate();

  const formatDate = (rawDate) => {
    const dateObj = new Date(rawDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options); // e.g. 9 July 2023
  };

  return (
    <div className="TableData-cohort-comp">
      {isTeacher ? (
        <>
          <li>{formatDate(createdAt)}</li>
          <li
            onClick={() =>
              navigate(`/cohorts/${cohortUid}`, {
                state: { ...cohort }
              })
            }
            className="cohort-hover">
            {capitalizeFirstChar(cohortName)}
          </li>
          <li>{numberOfStudent}</li>
          <li>
            {plannedSessions.toString().padStart(2, '0')} out of{' '}
            {noOfSessions.toString().padStart(2, '0')}
          </li>
        </>
      ) : (
        <>
          <li>{cohortUid.substring(0, 4)}</li>
          <li
            onClick={() =>
              navigate(`/cohorts/${cohortUid}`, {
                state: { ...cohort }
              })
            }
            className="cohort-hover">
            {capitalizeFirstChar(cohortName)}
          </li>
          <li style={{ paddingLeft: '30px' }}>{numberOfStudent}</li>
          <li style={{ paddingLeft: '30px' }}>{plannedSessions}</li>
          <li style={{ paddingLeft: '30px' }}>{completedSessions}</li>
          <li>{createdAt.split(' ')[0]}</li>
          <li
            onClick={() =>
              navigate('/cohorts/editcohort', {
                state: {
                  cohortUid
                }
              })
            }>
            <img className="edit-img-cohort" src={edit} alt="edit" />
          </li>
        </>
      )}
    </div>
  );
};

const Cohorts = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [cohortAll, seCohortAll] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectValue, setSelectValue] = useState({});
  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setLoader(true);
    if (user?.entity === 'moderator') {
      callAPI(
        'get',
        `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read?moderatoruid=${user?.uid}`
      )
        .then((cohortAllData) => {
          seCohortAll(cohortAllData);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } else if (user?.entity === 'teacher') {
      callAPI(
        'get',
        `https://qalb91pdu7.execute-api.us-east-1.amazonaws.com/testing/cohort-teacher-read?teacheremail=${user?.emailId}`
      )
        .then((cohortAllData) => {
          seCohortAll(cohortAllData);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } else {
      callAPI('get', 'https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read')
        .then((cohortAllData) => {
          seCohortAll(cohortAllData);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    }

    callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
      .then((schoolAll) => {
        setSchoolList(schoolAll);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    if (selectValue?.school) {
      const schoolName = selectValue?.school || '';
      setLoader(true);
      callAPI(
        'get',
        `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read?schoolname=${schoolName}`
      )
        .then((sessionAllData) => {
          seCohortAll(sessionAllData);
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
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
        lastValue={'Cohorts'}
      />

      <div className="accounts-header">
        <h1>Cohorts</h1>
        <div className="cohort-top-btn">
          {user?.entity === 'moderator' || user?.entity === 'teacher' ? null : (
            <button
              className="create-cohort-btn"
              onClick={() => {
                navigate('/cohorts/createcohort');
              }}>
              Create Cohort
            </button>
          )}
          {user?.entity === 'teacher' ? null : (
            <div className="stu-dr-1 ct-1">
              <p>Filter School</p>
              <SelectInputFieldMod
                options={schoolList}
                selectData={(dataValue) =>
                  setSelectValue({ ...selectValue, school: dataValue })
                }
                select={selectValue.school}
                providedList="school"
              />
            </div>
          )}
        </div>
      </div>

      {user?.entity === 'teacher' ? <TeacherCohorts /> : loader ? <Loader /> : (
        <div className="cohort-table-container">
          <div className="cohort-table-header">
            <TableHeader />
          </div>
          <div className="student-table-body">
            {cohortAll.map((cohort) => (
              <TableData
                key={cohort.cohortUid}
                createdAt={cohort.createdAt}
                cohortUid={cohort.cohortUid}
                cohortName={cohort.cohortName}
                numberOfStudent={cohort.noOfstudents}
                plannedSessions={cohort.plannedSessions}
                completedSessions={cohort.completedSessions}
                noOfSessions={cohort.noOfSessions}
                cohort={cohort}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Cohorts;