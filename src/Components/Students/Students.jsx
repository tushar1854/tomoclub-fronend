import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './students.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { callAPI, getSessionStorage } from '../../Helper';
import Loader from '../Common/Loader/Loader';
import SelectInputFieldMod from '../Common/SelectInputFieldMod/SelectInputFieldMod';

const TableHeader = () => {
  return (
    <div className="TableHeader-comp">
      <li>Student ID</li>
      <li>Student Name</li>
      <li>Cohort Name</li>
      <li>School Name</li>
      <li>Joining Date</li>
    </div>
  );
};
const TableData = ({ studentUsername, cohortName, firstName, lastName, schoolName, createdAt }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-comp">
      <li
        onClick={() => {
          navigate(`/students/${studentUsername}`);
        }}
      >
        {studentUsername}
      </li>
      <li
        onClick={() => {
          navigate(`/students/${studentUsername}`);
        }}
      >
        {firstName + ' ' + lastName}
      </li>
      <li>{cohortName}</li>
      <li>{schoolName}</li>
      <li>{createdAt?.split(' ')[0]}</li>
    </div>
  );
};

const Students = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [studentAll, setStudentAll] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectValue, setSelectValue] = useState({});

  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setLoader(true);
    if (user?.entity === 'moderator') {
      callAPI(
        'get',
        `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?moderatoruid=${user?.uid}`
      )
        .then((studentAllData) => {
          console.log(studentAllData);
          setStudentAll(studentAllData);
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
      callAPI('get', 'https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read')
        .then((studentAllData) => {
          console.log(studentAllData);
          setStudentAll(studentAllData);
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
          `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?moderatoruid=${user?.uid}&cohortid=${cohortUid}&schoolname=${schoolName}`
        )
          .then((sessionAllData) => {
            console.log(sessionAllData);
            setStudentAll(sessionAllData);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);
          });
      } else {
        callAPI(
          'get',
          `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?cohortid=${cohortUid}&schoolname=${schoolName}`
        )
          .then((sessionAllData) => {
            console.log(sessionAllData);
            setStudentAll(sessionAllData);
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
    <div className="students-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Students'}
      />
      <div className="accounts-header">
        <div className="add-school-input-box">
          <h1>Add Students</h1>
          <div className="st-add-school-select-box">
            {user?.entity === 'moderator' ? null : (
              <button
                className="add-new-school-btn"
                type="submit"
                onClick={() => navigate('/accounts/addstudent')}
              >
                + Add Student
              </button>
            )}
            <div className="stu-dr-1">
              <p>Filter School</p>
              <SelectInputFieldMod
                options={schoolList}
                selectData={(dataValue) => setSelectValue({ ...selectValue, school: dataValue })}
                select={selectValue.school}
                providedList="school"
              />
            </div>
            <div className="stu-dr-1">
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
      </div>

      {/* table work starts */}
      {loader ? (
        <Loader />
      ) : (
        <div className="student-table-container">
          <div className="student-table-header">
            <TableHeader />
          </div>
          <div className="student-table-body">
            {studentAll.map((student) => (
              <TableData
                key={student.studentUsername + student.cohortName}
                cohortName={student.cohortName}
                createdAt={student.createdAt}
                firstName={student.firstName}
                lastName={student.lastName}
                schoolName={student.schoolName}
                studentUsername={student.studentUsername}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
