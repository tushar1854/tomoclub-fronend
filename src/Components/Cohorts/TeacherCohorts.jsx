import React, { useEffect, useState } from 'react';
import './teacherCohorts.scss';
import { callAPI, getSessionStorage } from '../../Helper';

const TeacherCohorts = () => {
  const user = JSON.parse(getSessionStorage('user'));
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // For session screen
  const [viewSessionScreen, setViewSessionScreen] = useState(false);
  const [allSessions, setAllSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionData, setSessionData] = useState({
    session_date: '',
    session_topic: '',
    attendance: '',
    session_rating: ''
  });

  const [sessionDataTable, setSessionDataTable] = useState([]);
  const [confirmDisabled, setConfirmDisabled] = useState(true);

  const handleConfirm = async () => {
    if (!selectedSessionId) return;
    try {
      const data = await callAPI(
        'get',
        `https://r27fc42lxa.execute-api.us-east-1.amazonaws.com/testing/get_student_data_based_on_session_for_cohort_flow?sessionid=${selectedSessionId}`
      );
      setSessionDataTable(data.students || []);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };


  const handleViewSessionClick = async () => {
    try {
      const res = await callAPI(
        'get',
        `https://zzpq0vmz17.execute-api.us-east-1.amazonaws.com/testing/session-teacher?teacheruid=${teacherUid}`
      );
      console.log('Session Data:', res);
      console.log('Selected Cohort:', selectedCohort);
      // Filter session IDs for selected cohort name
      const matchingSessionIds = (res || [])
        .filter(session => session.cohortUid === selectedCohort)
        .map(session => session.sessionId);
      setAllSessions(matchingSessionIds);
      console.log('All Sessions:', matchingSessionIds);
    } catch (err) {
      console.error('Error fetching session data:', err);
    }
  };


  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSessionId(sessionId);
    setConfirmDisabled(!sessionId);

    if (sessionId) {
      try {
        const data = await callAPI(
          'get',
          `https://fft7256x6h.execute-api.us-east-1.amazonaws.com/testing/get_session_data_for_cohort_teacher_flow?sessionid=${sessionId}`
        );

        setSessionData({
          session_date: data.date,
          session_topic: data.sessionTopic,
          attendance: data.attendancePercentage,
          session_rating: data.sessionRating,
        });
      } catch (err) {
        console.error('Error fetching session data:', err);
      }
    }
  };




  const teacherUid = user?.uid;

  const formatDate = (rawDate) => {
    const dateObj = new Date(rawDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options); // e.g. 9 July 2023
  };

  // Fetch teacher cohorts once
  useEffect(() => {
    if (teacherUid) {
      callAPI('get', `https://zzpq0vmz17.execute-api.us-east-1.amazonaws.com/testing/session-teacher?teacheruid=${teacherUid}`)
        .then((res) => {
          const uniqueCohorts = [];
          const seenUids = new Set();

          res.forEach(item => {
            if (!seenUids.has(item.cohortUid)) {
              seenUids.add(item.cohortUid);
              uniqueCohorts.push({
                cohortName: item.cohortName,
                cohortUid: item.cohortUid,
              });
            }
          });

          setCohorts(uniqueCohorts);
        })
        .catch((err) => console.error('Error fetching teacher cohorts:', err));
    }
  }, [teacherUid]);

  // Handle cohort selection
  const handleCohortSelect = (e) => {
    const cohortName = e.target.value;
    const selectedCohortData = cohorts.find(cohort => cohort.cohortName === cohortName);
    const cohortUid = selectedCohortData?.cohortUid || '';

    setSelectedCohort(cohortUid);
    setLoading(true);

    callAPI('get', `https://t2mo9hijy3.execute-api.us-east-1.amazonaws.com/testing/teacher_cohort_read_dashboard_count_data?cohortuid=${cohortUid}`)
      .then((res) => {
        setStats(res);
      })
      .catch((err) => console.error('Error fetching stats:', err))
      .finally(() => setLoading(false));
  };

  const renderStatValue = (key) => {
    if (!selectedCohort || loading) return '';
    return key === 'percentagePresent' ? `${(stats[key] || 0) / 100}%` : (stats[key] || 0);
  };

  const renderDate = () => {
    if (!selectedCohort || loading) return '';
    return stats.createdAt ? formatDate(stats.createdAt) : '-';
  }

  const renderSessionDataDate = () => {
    if (!selectedSessionId || loading) return '';
    return sessionData.session_date ? formatDate(sessionData.session_date) : '-';
  }

  return (
    <>
      {!viewSessionScreen ? (
        <div className="teacher-cohort-dashboard">
          <div className="dropdown-container">
            <label>Select a Cohort:</label>
            <select
              value={cohorts.find(c => c.cohortUid === selectedCohort)?.cohortName || ''}
              onChange={handleCohortSelect}
            >
              <option value="">-- Select --</option>
              {cohorts.map((cohort) => (
                <option key={cohort.cohortUid} value={cohort.cohortName}>
                  {cohort.cohortName}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-cards">
            <div className="card card-a">
              <p>Total Sessions</p>
              <h1>{renderStatValue('totalSessions')}</h1>
            </div>
            <div className="card card-b">
              <p>Total Students</p>
              <h1>{renderStatValue('totalStudents')}</h1>
            </div>
            <div className="card card-c">
              <p>Pre-session Rating (Students)</p>
              <h1>{renderStatValue('preSessionRatingStudent')}</h1>
            </div>
            <div className="card card-a">
              <p>Post-session Rating (Students)</p>
              <h1>{renderStatValue('postSessionRatingStudent')}</h1>
            </div>
            <div className="card card-b">
              <p>Avg. Attendance</p>
              <h1>{renderStatValue('percentagePresent')}</h1>
            </div>
            <div className="card card-c">
              <p>Session Rating (Teachers)</p>
              <h1>{renderStatValue('teacherRating')}</h1>
            </div>
            <div className="card card-a">
              <p>Student Enthusiasm (Teachers)</p>
              <h1>{renderStatValue('student_enthusiasm')}</h1>
            </div>
            <div className="card card-b">
              <p>Date of Creation</p>
              <h1>{selectedCohort && !loading ? (renderDate() || '-') : ''}</h1>
            </div>
          </div>

          {selectedCohort && !loading && (
            <div className="action-buttons">
              <button className="edit-btn">Edit Students</button>
              <button
                className="edit-btn"
                onClick={() => {
                  setViewSessionScreen(true);
                  handleViewSessionClick(); // fetch all sessions
                }}
              >
                View Sessions
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="session-screen">
          <div className="session-layout">
            {/* Left Side: Session ID Dropdown + Confirm */}
            <div className="session-left">
              <div className="select-row-container">
                <label>Select Session ID:</label>
                <select value={selectedSessionId} onChange={handleSessionChange}>
                  <option value="">-- Select --</option>
                  {allSessions.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <button className="confirm-btn" onClick={handleConfirm} disabled={confirmDisabled}>
                Confirm
              </button>
            </div>

            {/* Right Side: Data fields */}
            <div className="session-right">
              <div className="field">
                <span className="label">Session Date:</span>
                <span>{renderSessionDataDate() || '-'}</span>
              </div>
              <div className="field">
                <span className="label">Session Topic:</span>
                <span>{sessionData.session_topic || '-'}</span>
              </div>
              <div className="field">
                <span className="label">Attendance:</span>
                <span>{sessionData.attendance ? `${sessionData.attendance}%` : '-'}</span>
              </div>
              <div className="field">
                <span className="label">Session Rating:</span>
                <span>{sessionData.session_rating || '-'}</span>
              </div>
            </div>
          </div>

          {sessionDataTable.length > 0 && (
            <div className='teacher-cohorts'>
              <div className="table-container">
                <div className="table-header-list">
                  <li>Name</li>
                  <li>Username</li>
                  <li>Present</li>
                  <li>Pre-Session Rating</li>
                  <li>Mood</li>
                  <li>Post-Session Rating</li>
                  <li>Game Rating</li>
                  <li>Correct Answers</li>
                </div>

                {sessionDataTable.map((student, index) => (
                  <ul className="table-data-list" key={index}>
                    <li>{student.studentFirstName} {student.studentLastName}</li>
                    <li>{student.studentUsername}</li>
                    <li>{student.present ? 'Yes' : 'No'}</li>
                    <li>{student.preSessionRating === false ? '-' : student.preSessionRating}</li>
                    <li>{student.mood === false ? '-' : student.mood}</li>
                    <li>{student.postSessionRating === false ? '-' : student.postSessionRating}</li>
                    <li>{student.gameRating === false ? '-' : student.gameRating}</li>
                    <li>{student.correctAnswerCount === 0 ? '-' : student.correctAnswerCount}</li>
                  </ul>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );

};

export default TeacherCohorts;
