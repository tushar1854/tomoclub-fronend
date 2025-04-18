import React, { useState } from 'react';
import { callAPI } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      <li>Student Name</li>
      <li>Present</li>
      <li>Evaluation</li>
    </div>
  );
};
const TableData = ({ studentName, attend, setAttend, isEditAttendance, evalStu }) => {
  const handleCheckboxChange = () => {
    setAttend((prevState) => ({
      ...prevState,
      [studentName]: !attend[studentName]
    }));
  };
  return (
    <div className="TableData-cohort-comp">
      <li>{studentName}</li>
      <li className="attendence-checkbox">
        <input
          type="checkbox"
          checked={attend[studentName]}
          onChange={handleCheckboxChange}
          disabled={!isEditAttendance}
        />
      </li>
      <li className="attendence-checkbox">
        <input type="checkbox" checked={evalStu[studentName]} disabled={true} />
      </li>
    </div>
  );
};
const Attendance = ({
  setAttendanceStu,
  attendanceStu,
  attendanceStuEval,
  students,
  sessionId,
  isEditAttendance,
  setIsEditAttendance
}) => {
  const [loader, setLoader] = useState(false);
  const handleSessionAttend = () => {
    if (isEditAttendance) {
      const output = {};
      students.forEach((item) => {
        output[item] = attendanceStu[item] || false;
      });
      console.log(output);
      setLoader(true);
      callAPI('post', 'https://vg7nstq4w3.execute-api.us-east-1.amazonaws.com/testing/attendance', {
        sessionId,
        studentInfo: output
      })
        .then((res) => {
          console.log(res);
          setLoader(false);
          setIsEditAttendance(!isEditAttendance);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsEditAttendance(!isEditAttendance);
    }
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="create-curr4-form-container">
          <div className="attendance-flex">
            <div className="cohort-table-container-2">
              <div className="cohort-table-header">
                <TableHeader />
              </div>
              <div className="student-table-body">
                {students.map((student) => (
                  <TableData
                    key={student}
                    studentName={student}
                    attend={attendanceStu}
                    evalStu={attendanceStuEval}
                    setAttend={setAttendanceStu}
                    isEditAttendance={isEditAttendance}
                  />
                ))}
              </div>
            </div>
            <div className="attendance-btn-work">
              <div>
                <button
                  className="accordian-btn-attendance"
                  onClick={() =>
                    window.open(
                      `https://5nynvhrbr3.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${sessionId}`,
                      '_blank'
                    )
                  }
                >
                  Download Attendance
                </button>
              </div>
              <div>
                <button className="accordian-btn-attendance" onClick={handleSessionAttend}>
                  {isEditAttendance ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>{' '}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
