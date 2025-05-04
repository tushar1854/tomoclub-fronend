// import React, { useState } from 'react';
// import { callAPI } from '../../../Helper';
// import Loader from '../../Common/Loader/Loader';
// const TableHeader = () => {
//   return (
//     <div className="TableHeader-cohort-comp">
//       <li>Student Name</li>
//       <li>Present</li>
//       <li>Evaluation</li>
//     </div>
//   );
// };
// const TableData = ({ studentName, attend, setAttend, isEditAttendance, evalStu }) => {
//   const handleCheckboxChange = () => {
//     setAttend((prevState) => ({
//       ...prevState,
//       [studentName]: !attend[studentName]
//     }));
//   };
//   return (
//     <div className="TableData-cohort-comp">
//       <li>{studentName}</li>
//       <li className="attendence-checkbox">
//         <input
//           type="checkbox"
//           checked={attend[studentName]}
//           onChange={handleCheckboxChange}
//           disabled={!isEditAttendance}
//         />
//       </li>
//       <li className="attendence-checkbox">
//         <input type="checkbox" checked={evalStu[studentName]} disabled={true} />
//       </li>
//     </div>
//   );
// };
// const Attendance = ({
//   setAttendanceStu,
//   attendanceStu,
//   attendanceStuEval,
//   students,
//   sessionId,
//   isEditAttendance,
//   setIsEditAttendance
// }) => {
//   const [loader, setLoader] = useState(false);
//   const handleSessionAttend = () => {
//     if (isEditAttendance) {
//       const output = {};
//       students.forEach((item) => {
//         output[item] = attendanceStu[item] || false;
//       });
//       console.log(output);
//       setLoader(true);
//       callAPI('post', 'https://vg7nstq4w3.execute-api.us-east-1.amazonaws.com/testing/attendance', {
//         sessionId,
//         studentInfo: output
//       })
//         .then((res) => {
//           console.log(res);
//           setLoader(false);
//           setIsEditAttendance(!isEditAttendance);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       setIsEditAttendance(!isEditAttendance);
//     }
//   };

//   return (
//     <div>
//       {loader ? (
//         <Loader />
//       ) : (
//         <div className="create-curr4-form-container">
//           <div className="attendance-flex">
//             <div className="cohort-table-container-2">
//               <div className="cohort-table-header">
//                 <TableHeader />
//               </div>
//               <div className="student-table-body">
//                 {students.map((student) => (
//                   <TableData
//                     key={student}
//                     studentName={student}
//                     attend={attendanceStu}
//                     evalStu={attendanceStuEval}
//                     setAttend={setAttendanceStu}
//                     isEditAttendance={isEditAttendance}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className="attendance-btn-work">
//               <div>
//                 <button
//                   className="accordian-btn-attendance"
//                   onClick={() =>
//                     window.open(
//                       `https://5nynvhrbr3.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${sessionId}`,
//                       '_blank'
//                     )
//                   }
//                 >
//                   Download Attendance
//                 </button>
//               </div>
//               <div>
//                 <button className="accordian-btn-attendance" onClick={handleSessionAttend}>
//                   {isEditAttendance ? 'Save' : 'Edit'}
//                 </button>
//               </div>
//             </div>{' '}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Attendance;


import React, { useState } from 'react';
import { callAPI } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
import './Attendance.css';

const TableHeader = () => {
  return (
    <div className="attendance-table-header">
      <li className="table-header-cell">Student Name</li>
      <li className="table-header-cell">Present</li>
      <li className="table-header-cell">Evaluation</li>
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
    <div className="attendance-row">
      <li className="row-cell student-name">{studentName}</li>
      <li className="row-cell">
        <input
          type="checkbox"
          checked={attend[studentName]}
          onChange={handleCheckboxChange}
          disabled={!isEditAttendance}
        />
      </li>
      <li className="row-cell">
        <input type="checkbox" checked={evalStu[studentName]} disabled />
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
      setLoader(true);
      callAPI('post', 'https://vg7nstq4w3.execute-api.us-east-1.amazonaws.com/testing/attendance', {
        sessionId,
        studentInfo: output
      })
        .then((res) => {
          console.log(res);
          setLoader(false);
          setIsEditAttendance(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } else {
      setIsEditAttendance(true);
    }
  };

  return (
    <div className="attendance-wrapper">
      {loader ? (
        <Loader />
      ) : (
        <div className="attendance-container">
          <div className="attendance-content">
            <div className="attendance-table">
              <TableHeader />
              <div className="attendance-body">
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
            <div className="attendance-actions">
              <button
                className="attendance-btn"
                onClick={() =>
                  window.open(
                    `https://5nynvhrbr3.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${sessionId}`,
                    '_blank'
                  )
                }
              >
                Download Attendance ⬇️
              </button>
              <button className="attendance-btn" onClick={handleSessionAttend}>
                {isEditAttendance ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
