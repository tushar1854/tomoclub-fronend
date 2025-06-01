// EditStudents.jsx
import React, { useEffect, useState } from 'react';
import { callAPI, getSessionStorage } from '../../Helper';

const EditStudents = ({ cohortUid, onBack }) => {
  const [existingStudents, setExistingStudents] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [addedStudents, setAddedStudents] = useState([]);
  const [deletedStudents, setDeletedStudents] = useState([]);

  useEffect(() => {
    const user = JSON.parse(getSessionStorage('user'));
    const email = user?.emailId;

    const fetchStudents = async () => {
      try {
        const existingRes = await callAPI('get',
          `https://1e92zwdhz8.execute-api.us-east-1.amazonaws.com/testing/get_student_list_for_cohort?cohortuid=${cohortUid}`
        );
        setExistingStudents(existingRes.students || []);

        const eligibleRes = await callAPI('get',
          `https://cyy0n301fd.execute-api.us-east-1.amazonaws.com/testing/get_student_list_for_particular_school_not_present_in_cohort?cohortuid=${cohortUid}&emailid=${email}`
        );
        setEligibleStudents(eligibleRes.eligibleStudentUsernames || []);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    fetchStudents();
  }, [cohortUid]);

  const handleAddStudent = (studentUsername) => {
    setAddedStudents(prev => [...prev, studentUsername]);
    setExistingStudents(prev => [{ studentUsername }, ...prev]);
  };

  const handleToggleDelete = (studentUsername) => {
    setDeletedStudents(prev => 
      prev.includes(studentUsername) ? 
      prev.filter(name => name !== studentUsername) : 
      [...prev, studentUsername]
    );
  };

  const handleSave = async () => {
    try {
      await callAPI('post', 'https://syxus6wgrh.execute-api.us-east-1.amazonaws.com/testing/cohort_student_update_by_teachder', {
        cohortuid: cohortUid,
        addedStudents,
        deletedStudents
      });
      alert("Students updated successfully!");
      onBack(); // Go back to main screen
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="edit-students-container">
    <div className='edit-students-main-box'>
        <label>Search and add student:</label>
        <select onChange={(e) => handleAddStudent(e.target.value)} defaultValue="">
            <option value="" disabled>-- Select Student --</option>
            {eligibleStudents.map((student, idx) => (
            <option key={idx} value={student}>{student}</option>
            ))}
        </select>
        <ul className="student-list">
          {existingStudents.map((s, idx) => {
            const username = s.studentUsername;
            const isAdded = addedStudents.includes(username);
            const isDeleted = deletedStudents.includes(username);

            // Set name color:
            const nameColor = isDeleted ? 'red' : isAdded ? 'green' : 'black';

            return (
              <li key={idx} style={{ color: nameColor }}>
                {username}
                <button
                  className={isDeleted ? 'undo-button' : 'delete-button'}
                  onClick={() => handleToggleDelete(username)}
                >
                  {isDeleted ? 'Undo' : 'Delete'}
                </button>
              </li>
            );
          })}
        </ul>
    </div>

    <button className='save-button' onClick={handleSave}>Save Students</button>
    </div>
  );
};

export default EditStudents;
