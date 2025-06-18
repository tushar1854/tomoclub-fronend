import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './students.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { callAPI, getSessionStorage } from '../../Helper';
import Loader from '../Common/Loader/Loader';
import SelectInputFieldMod from '../Common/SelectInputFieldMod/SelectInputFieldMod';

const TableHeader = () => (
  <div className="TableHeader-comp">
    <li>Student ID</li>
    <li>Student Name</li>
    <li>Cohort Name</li>
    <li>School Name</li>
    <li>Joining Date</li>
  </div>
);

const TeacherTableHeader = () => (
  <div className="TableHeader-comp">
    <li>Student ID</li>
    <li>Student Name</li>
    <li>Cohort Name</li>
    <li>Password</li>
    <li>Joining Date</li>
  </div>
);

const TableData = ({ studentUsername, cohortName, firstName, lastName, schoolName, createdAt }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-comp">
      <li onClick={() => navigate(`/students/${studentUsername}`)}>{studentUsername}</li>
      <li onClick={() => navigate(`/students/${studentUsername}`)}>{firstName + ' ' + lastName}</li>
      <li>{cohortName}</li>
      <li>{schoolName}</li>
      <li>{createdAt?.split(' ')[0]}</li>
    </div>
  );
};

const TeacherTableData = ({ studentUsername, cohortName, firstName, lastName, password, joiningDate,cohortUid }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-comp">
      <li
        onClick={() =>
          navigate(`/students/${studentUsername}`, {
            state: { cohortUid } // Pass cohortUid here
          })
        }
      >
        {studentUsername}
      </li>

      <li onClick={() => navigate(`/students/${studentUsername}`)}>{firstName + ' ' + lastName}</li>
      <li>{cohortName}</li>
      <li>{password || '-'}</li>
      <li>{joiningDate?.split(' ')[0]}</li>
    </div>
  );
};

const Students = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [studentAll, setStudentAll] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [selectValue, setSelectValue] = useState({});

  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setLoader(true);

    if (user?.entity === 'teacher') {
      callAPI('get', `https://qalb91pdu7.execute-api.us-east-1.amazonaws.com/testing/cohort-teacher-read?teacheremail=${user?.emailId}`)
        .then((cohortAll) => {
          const uniqueCohorts = cohortAll.filter(
            (cohort, index, self) => index === self.findIndex((c) => c.cohortUid === cohort.cohortUid)
          );
          setCohortList(uniqueCohorts);
        })
        .catch((error) => console.log(error));

      const baseUrl = 'https://4qoq5fhb01.execute-api.us-east-1.amazonaws.com/testing/student-teacher-read';
      const cohortUidParam = selectValue?.cohort?.cohortUid ? `&cohortuid=${selectValue?.cohort?.cohortUid}` : '';
      callAPI('get', `${baseUrl}?teacheremail=${user?.emailId}${cohortUidParam}`)
        .then((studentData) => {
          setStudentAll(studentData);
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
      return;
    }

    // Logic for other entities (moderator/admin)
    callAPI('get', `https://di6m4ty5z0.execute-api.us-east-1.amazonaws.com/testing/student_read${user?.entity === 'moderator' ? `?moderatoruid=${user?.uid}` : ''}`)
      .then(setStudentAll)
      .catch(console.log);

    callAPI('get', `https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read${user?.entity === 'moderator' ? `?moderatoruid=${user?.uid}` : ''}`)
      .then(setCohortList)
      .catch(console.log);

    callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
      .then((schoolAll) => {
        setSelectValue((prev) => ({ ...prev, schoolList: schoolAll }));
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, [selectValue?.cohort]);

  return (
    <div className="students-container">
      <BreadcrumbsLink breadcrumbValues={{ 1: { name: 'Home', link: '/home' } }} lastValue={'Students'} />
      <div className="accounts-header">
        <div className="add-school-input-box">
          <h1>Add Students</h1>
          <div className="st-add-school-select-box">
            {user?.entity === 'moderator' || user?.entity === 'admin' ? (
              <button
                className="add-new-school-btn"
                type="submit"
                onClick={() => navigate('/accounts/addstudent')}
              >
                + Add Student
              </button>
            ) : null}
            {user?.entity === 'teacher' ? (
              <div className="stu-dr-1-teacher">
                <p>Filter Student by Cohort:</p>
                <SelectInputFieldMod
                  options={cohortList}
                  selectData={(dataValue) => setSelectValue({ ...selectValue, cohort: dataValue })}
                  select={selectValue.cohort}
                  providedList="cohort"
                />
              </div>
            ) : (
              <>
                <div className="stu-dr-1">
                  <p>Filter School</p>
                  <SelectInputFieldMod
                    options={selectValue.schoolList || []}
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
                    providedList="cohort"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loader ? (
        <Loader />
      ) : (
        <div className="student-table-container">
          <div className="student-table-header">
            {user?.entity === 'teacher' ? <TeacherTableHeader /> : <TableHeader />}
          </div>
          <div className="student-table-body">
            {studentAll.map((student) => (
              user?.entity === 'teacher' ? (
                <TeacherTableData key={student.studentUsername + student.cohortName} {...student} />
              ) : (
                <TableData
                  key={student.studentUsername + student.cohortName}
                  cohortName={student.cohortName}
                  createdAt={student.createdAt}
                  firstName={student.firstName}
                  lastName={student.lastName}
                  schoolName={student.schoolName}
                  studentUsername={student.studentUsername}
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
