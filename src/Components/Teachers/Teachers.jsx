import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './teachers.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { callAPI, getSessionStorage } from '../../Helper';
import Loader from '../Common/Loader/Loader';
// import SelectInputFieldMod from '../Common/SelectInputFieldMod/SelectInputFieldMod';

const TableHeader = () => {
  return (
    <div className="TableHeader-comp">
      <li>Staff ID</li>
      <li>Teacher Name</li>
      <li>School</li>
      <li>Email ID</li>
      <li>Phone No.</li>
    </div>
  );
};
const TableData = ({ staffId, emailId, firstName, lastName, schoolName, phoneNumber }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-comp">
      <li
        onClick={() => {
          navigate(`/teachers/${staffId}`);
        }}
      >
        {staffId}
      </li>
      <li
        onClick={() => {
          navigate(`/teachers/${staffId}`);
        }}
      >
        {firstName + ' ' + lastName}
      </li>
      <li>{emailId}</li>
      <li>{schoolName}</li>
      <li>{phoneNumber?.split(' ')[0]}</li>
    </div>
  );
};

const Teachers = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [teacherAll, setteacherAll] = useState([]);
  // const [cohortList, setCohortList] = useState([]);
  // const [schoolList, setSchoolList] = useState([]);
  // const [selectValue, setSelectValue] = useState({});

  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://l2nxmy3sh0.execute-api.us-east-1.amazonaws.com/testing/teacher_read')
      .then((teacherAllData) => {
        console.log(teacherAllData);
        setteacherAll(teacherAllData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  //   if (user?.entity === 'moderator') {
  //     callAPI(
  //       'get',
  //       `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?moderatoruid=${user?.uid}`
  //     )
  //       .then((teacherAllData) => {
  //         console.log(teacherAllData);
  //         setteacherAll(teacherAllData);
  //         // setLoader(false);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setLoader(false);
  //       });
  //     // callAPI(
  //     //   'get',
  //     //   `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read?moderatoruid=${user?.uid}`
  //     // )
  //     //   .then((cohortAll) => {
  //     //     console.log(cohortAll);
  //     //     setCohortList(cohortAll);
  //     //     // setLoader(false);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log(error);
  //     //     setLoader(false);
  //     //   });
  //   } else {
  //     callAPI('get', 'https://l2nxmy3sh0.execute-api.us-east-1.amazonaws.com/testing/teacher_read')
  //       .then((teacherAllData) => {
  //         console.log(teacherAllData);
  //         setteacherAll(teacherAllData);
  //         // setLoader(false);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setLoader(false);
  //       });
  //     // callAPI('get', 'https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read')
  //     //   .then((cohortAll) => {
  //     //     console.log(cohortAll);
  //     //     setCohortList(cohortAll);
  //     //     // setLoader(false);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log(error);
  //     //     setLoader(false);
  //     //   });
  //   }
  //   // callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
  //   //   .then((schoolAll) => {
  //   //     console.log(schoolAll);
  //   //     setSchoolList(schoolAll);
  //   //     setLoader(false);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.log(error);
  //   //     setLoader(false);
  //   //   });
  // }, []);

  // useEffect(() => {
  //   if (selectValue?.cohort?.cohortUid || selectValue?.school) {
  //     const cohortUid = selectValue?.cohort?.cohortUid || '';
  //     const schoolName = selectValue?.school || '';
  //     setLoader(true);
  //     if (user?.entity === 'moderator') {
  //       callAPI(
  //         'get',
  //         `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?moderatoruid=${user?.uid}&cohortid=${cohortUid}&schoolname=${schoolName}`
  //       )
  //         .then((sessionAllData) => {
  //           console.log(sessionAllData);
  //           setteacherAll(sessionAllData);
  //           setLoader(false);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           setLoader(false);
  //         });
  //     } else {
  //       callAPI(
  //         'get',
  //         `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read?cohortid=${cohortUid}&schoolname=${schoolName}`
  //       )
  //         .then((sessionAllData) => {
  //           console.log(sessionAllData);
  //           setteacherAll(sessionAllData);
  //           setLoader(false);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           setLoader(false);
  //         });
  //     }
  //   }
  // }, [selectValue]);

  return (
    <div className="students-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Teacher'}
      />
      <div className="accounts-header">
        <div className="add-school-input-box">
          <h1>Add Teachers</h1>
          <div className="st-add-school-select-box">
            {user?.entity === 'moderator' ? null : (
              <button
                className="add-new-teacher-btn"
                type="submit"
                onClick={() => navigate('/accounts/addteacher')}
              >
                + Add Teacher
              </button>
            )}
            {/* <div className="stu-dr-1">
              <p>Filter School</p>
              <SelectInputFieldMod
                options={schoolList}
                selectData={(dataValue) => setSelectValue({ ...selectValue, school: dataValue })}
                select={selectValue.school}
                providedList="school"
              />
            </div> */}
            {/* <div className="stu-dr-1">
              <p>Filter Cohort</p>
              <SelectInputFieldMod
                options={cohortList}
                selectData={(dataValue) => setSelectValue({ ...selectValue, cohort: dataValue })}
                select={selectValue.cohort}
                providedList={'cohort'}
              />
            </div> */}
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
            {teacherAll.map((teacher) => (
              <TableData
                key={teacher.staffId + teacher.emailId}
                emailId={teacher.emailId}
                phoneNumber={teacher.phoneNumber}
                firstName={teacher.firstName}
                lastName={teacher.lastName}
                schoolName={teacher.schoolName}
                staffId={teacher.staffId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
