'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { callAPI, convertTo24Hour} from '../../../Helper';
import { removeBeforeTime } from '../../../Helper/common';
import Constants from '../../../Constants';
import Loader from '../../Common/Loader/Loader';
import './teacher-edit-single-session.scss';
import Attendance from '../CommonSession/Attendance';


const TeacherEditSingleSession = ({ session, studentAll }) => {

  const convertTo12Hour = (time24) => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
  };
  console.log('session', session);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Session Details');
  const [loader, setLoader] = useState(false);
  const [isEditSessionDetail, setIsEditSessionDetail] = useState(true);
  const { handleSubmit, register } = useForm({ criteriaMode: 'all' });
  const [selectValue, setSelectValue] = useState({
    moderator: {
      moderatorName: session.sessionModerator || '',
      moderatorUid: session.moderatorUid || ''
    },
    startTime: session.sessionTime || '',
    endTime: session.sessionEndTime || '',
    timezone: session.timeZone || '',
    gameName: session.gameName || '',
    gameMode: session.gameMode || '',
    skillToFocus: session.skillInFocus
  });  
  const [skills, setSkills] = useState([]);
  const [singleStudentEval, setSingleStudentEval] = useState('');
  //const [studentListForEval, setStudentListForEval] = useState([]);
  //const [attendanceStu, setAttendanceStu] = useState({});
  const [sessionEval, setSessionEval] = useState({
    leadership: {
      'Initiative Taking and Tenacity': -1,
      'Effective Communication': -1,
      'Team Player': -1,
      'Team Building': -1,
      'Strategic Thinking': -1
    },
    emotionalIntelligence: {
      Empathy: -1,
      Resilience: -1,
      'Social Awareness': -1,
      'Emotional Self Awareness': -1,
      'Emotional Regulation': -1
    },
    innovation: {
      'Creative Thinking': -1,
      Flexibility: -1,
      Curiosity: -1,
      'Critical Thinking': -1,
      'Risk Taking': -1
    },
    remark: ''
  });

  const [attendanceStu, setAttendanceStu] = useState({});
  const [isEditAttendance, setIsEditAttendance] = useState(true);
  const [attendanceStuEval, setAttendanceStuEval] = useState({});

  useEffect(() => {
    if (session) {
      setSelectValue((prev) => ({
        ...prev,
        moderator: {
          moderatorName: session.sessionModerator || '',
          moderatorUid: session.moderatorUid || ''
        },
        startTime: convertTo12Hour(session.sessionTime || '00:00'),
        endTime: convertTo12Hour(session.sessionEndTime || '00:00'),
        timezone: session.timeZone || Constants.TIMEZONE[0],
        gameName: session.gameName || '',
        gameMode: session.gameMode || '',
        skillToFocus: session.skillInFocus || ''
      }));
    }
  }, []); // <-- empty dependency array so it runs once only
  

  console.log('Session:', session);
  console.log('Select Value:', selectValue);

  useEffect(() => {
    if (session.skillInFocus) {
      setSkills(session.skillInFocus.split(',').map((skill) => skill.trim()));
    } else {
      setSkills([]);
    }
  }, [session.skillInFocus]);

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://w2zs50l54d.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${session.sessionId}`
    )
    .then((res) => {
      if (res) {
        setAttendanceStu(res.studentInfo_attendance);
        setAttendanceStuEval(res.studentInfo_evaluation);
      }
      setLoader(false);
    })
    .catch((error) => {
      console.log(error);
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (singleStudentEval !== '') {
      setLoader(true);
      callAPI(
        'get',
        `https://ndco3rth29.execute-api.us-east-1.amazonaws.com/testing/evaluation-read?sessionid=${session.sessionId}`
      )
        .then((res) => {
          if (res.student[singleStudentEval]) {
            setSessionEval(res.student[singleStudentEval]);
          } else {
            setSessionEval({
              leadership: {
                'Initiative Taking and Tenacity': -1,
                'Effective Communication': -1,
                'Team Player': -1,
                'Team Building': -1,
                'Strategic Thinking': -1
              },
              emotionalIntelligence: {
                Empathy: -1,
                Resilience: -1,
                'Social Awareness': -1,
                'Emotional Self Awareness': -1,
                'Emotional Regulation': -1
              },
              innovation: {
                'Creative Thinking': -1,
                Flexibility: -1,
                Curiosity: -1,
                'Critical Thinking': -1,
                'Risk Taking': -1
              },
              remark: ''
            });
          }
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    }
  }, [singleStudentEval, session.sessionId]); 
  
  const onSubmit = (data) => {
    const sessionD = {
      cohortUid: session.cohortUid,
      info: {
        [session.sessionId]: {
          sessionId: session.sessionId,
          sessionModerator: session.sessionModerator,
          date: data.sessionDate,
          time: convertTo24Hour(selectValue.startTime).trim(),
          endTime: convertTo24Hour(selectValue.endTime).trim(),
          timezone: selectValue.timezone,
          gameName: session.gameName,
          gameMode: session.gameMode,
          skillInFocus: session.skillInFocus,
          moderatorUid: session.moderatorUid
        }
      }
    };

    console.log('Session Data:', sessionD);
  
    setLoader(true);
    callAPI(
      'post',
      'https://jesicg6quc.execute-api.us-east-1.amazonaws.com/testing/session-update',
      sessionD
    )
      .then(() => {
        navigate('/session');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };
  

  const handleReschedule = () => {
    setIsEditSessionDetail(false);
  };

  const handleViewLessonPlan = () => {
    // Implement view lesson plan functionality
    alert('View Lesson Plan functionality will be implemented here');
  };

  
  

  const today = new Date().toISOString().split('T')[0];

  const tabs = ['Session Details', 'Reports Status', 'Teacher Feedback', 'Students Feedback'];

  const renderSessionDetails = () => {
    if (isEditSessionDetail) {
      return (
        <div className="session-details">
          <div className="form-grid">
            {/* Row 1: Session Date & Time */}
            <div className="form-group">
              <label className="form-label">Session Date</label>
              <div className="date-inputs">
                <input
                  type="text"
                  className="form-control day-input"
                  value={session.date?.split('-')[2] || '03'}
                  disabled
                />
                <input
                  type="text"
                  className="form-control month-input"
                  value={session.date ? new Date(session.date).toLocaleString('default', { month: 'long' }) : 'December'}
                  disabled
                />
                <input
                  type="text"
                  className="form-control year-input"
                  value={session.date ? new Date(session.date).getFullYear() : '2023'}
                  disabled
                />
              </div>
            </div>
    
            <div className="form-group">
              <label className="form-label">Session Time</label>
              <div className="time-inputs">
                <input
                  type="text"
                  className="form-control time-input"
                  value={selectValue.startTime || '11:00am'}
                  disabled
                />
                <span className="separator">to</span>
                <input
                  type="text"
                  className="form-control time-input time-input-left"
                  value={selectValue.endTime || '12:00pm'}
                  disabled
                />
                <input
                  type="text"
                  className="form-control timezone-input"
                  value={selectValue.timezone || 'PST'}
                  disabled
                />
              </div>
            </div>
    
            {/* Row 2: Game Name & Game Mode */}
            <div className="form-group game-align">
              <label className="form-label">Game Name</label>
              <input
                type="text"
                className="form-control"
                value={session.gameName || 'The First Settlers'}
                disabled
              />
            </div>
    
            <div className="form-group game-align">
              <label className="form-label">Game Mode</label>
              <input
                type="text"
                className="form-control"
                value={session.gameMode || 'Chapter 01 - Normal'}
                disabled
              />
            </div>
    
            {/* Row 3: Skills */}
            <div className="form-group full-width">
              <label className="form-label">Skills in Focus</label>
              <div className="skills-container">
                {Array.isArray(skills) && skills.length > 0
                  ? skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill.trim()}
                      </span>
                    ))
                  : session.skillInFocus
                  ? session.skillInFocus.split(',').map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill.trim()}
                      </span>
                    ))
                  : <span className="skill-tag">No skills available</span>
                }
              </div>
            </div>


          </div>
    
          {/* Actions */}
          <div className="actions">
            {/*btn btn-secondary*/}
            <button onClick={handleReschedule} className="reschedule-btn">
              Reschedule
            </button>
            <a href="#" onClick={handleViewLessonPlan} className="link">
              View Lesson Plan
            </a>
          </div>
        </div>
      );    
    } else {
      return (
      <div className="session-details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Session Date</label>
                <input
                  type="date"
                  className="date-picker"
                  {...register('sessionDate', { required: 'This input is required.' })}
                  defaultValue={session.date}
                  min={today}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Time</label>
                <div className="time-inputs">
                  <select
                    className="form-control time-input"
                    value={selectValue.startTime}
                    onChange={(e) => setSelectValue({ ...selectValue, startTime: e.target.value })}
                  >
                    {Constants.TIME.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  <span className="separator">to</span>

                  <select
                    className="form-control time-input"
                    value={selectValue.endTime}
                    onChange={(e) => setSelectValue({ ...selectValue, endTime: e.target.value })}
                  >
                    {removeBeforeTime(Constants.TIME, selectValue.startTime).map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control timezone-input"
                    value={selectValue.timezone}
                    onChange={(e) => setSelectValue({ ...selectValue, timezone: e.target.value })}
                  >
                    {Constants.TIMEZONE.map((timezone, index) => (
                      <option key={index} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="reschedule-btn">
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsEditSessionDetail(true)}
                className="reschedule-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

  const renderReportsStatus = () => {
      return (
          <Attendance
            setAttendanceStu={setAttendanceStu}
            attendanceStu={attendanceStu}
            attendanceStuEval={attendanceStuEval} // optional if you want evaluation link too
            students={studentAll}
            sessionId={session.sessionId}
            isEditAttendance={isEditAttendance}
            setIsEditAttendance={setIsEditAttendance}
          />
      );    
  };

  const renderTeacherFeedback = () => {
    return (
      <div className="teacher-feedback">
        <h3 className="section-title">Teacher Feedback</h3>
        <div className="feedback-form">
          <div className="form-group">
            <label className="form-label">Session Effectiveness</label>
            <select className="form-control">
              <option value="">Select Rating</option>
              <option value="5">Excellent</option>
              <option value="4">Good</option>
              <option value="3">Average</option>
              <option value="2">Below Average</option>
              <option value="1">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Student Engagement</label>
            <select className="form-control">
              <option value="">Select Rating</option>
              <option value="5">Excellent</option>
              <option value="4">Good</option>
              <option value="3">Average</option>
              <option value="2">Below Average</option>
              <option value="1">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              placeholder="Enter your feedback about the session..."
            ></textarea>
          </div>
          <button className="btn-primary">Submit Feedback</button>
        </div>
      </div>
    );
  };

  const renderStudentsFeedback = () => {
    return (
      <div className="students-feedback">
        <h3 className="section-title">Students Feedback</h3>
        <div className="feedback-content">
          <div className="report-card">
            <div className="card-content">
              <h4>Student Evaluations</h4>
              <p>View student evaluations for this session</p>
            </div>
            <button
              onClick={() =>
                window.open(
                  `https://pzjhm1zapg.execute-api.us-east-1.amazonaws.com/testing/evaluation-download?sessionid=${session.sessionId}`,
                  '_blank'
                )
              }
              className="download-btn"
            >
              Download Report
            </button>
          </div>
          <div className="form-group">
            <label className="form-label">Select Student</label>
            <select
              className="form-control"
              value={singleStudentEval}
              onChange={(e) => setSingleStudentEval(e.target.value)}
            >
              <option value="">Select Student</option>
              {studentAll?.map((student, index) => (
                <option key={index} value={student.username}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          {singleStudentEval && (
            <div className="evaluation-card">
              <h4 className="card-title">Student Evaluation</h4>
              <div className="evaluation-stats">
                <div className="stat-row">
                  <span className="stat-label">Leadership Skills:</span>
                  <span className="stat-value">
                    {Object.values(sessionEval.leadership).filter((val) => val > 0).length > 0
                      ? `${
                          Object.values(sessionEval.leadership)
                            .filter((val) => val > 0)
                            .reduce((a, b) => a + b, 0) /
                          Object.values(sessionEval.leadership).filter((val) => val > 0).length
                        }/5`
                      : 'Not Evaluated'}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Emotional Intelligence:</span>
                  <span className="stat-value">
                    {Object.values(sessionEval.emotionalIntelligence).filter((val) => val > 0)
                      .length > 0
                      ? `${
                          Object.values(sessionEval.emotionalIntelligence)
                            .filter((val) => val > 0)
                            .reduce((a, b) => a + b, 0) /
                          Object.values(sessionEval.emotionalIntelligence).filter((val) => val > 0)
                            .length
                        }/5`
                      : 'Not Evaluated'}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Innovation:</span>
                  <span className="stat-value">
                    {Object.values(sessionEval.innovation).filter((val) => val > 0).length > 0
                      ? `${
                          Object.values(sessionEval.innovation)
                            .filter((val) => val > 0)
                            .reduce((a, b) => a + b, 0) /
                          Object.values(sessionEval.innovation).filter((val) => val > 0).length
                        }/5`
                      : 'Not Evaluated'}
                  </span>
                </div>
              </div>
              {sessionEval.remark && (
                <div className="remarks-section">
                  <h5 className="remarks-title">Remarks:</h5>
                  <p className="remarks-text">{sessionEval.remark}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Session Details':
        return renderSessionDetails();
      case 'Reports Status':
        return renderReportsStatus();
      case 'Teacher Feedback':
        return renderTeacherFeedback();
      case 'Students Feedback':
        return renderStudentsFeedback();
      default:
        return renderSessionDetails();
    }
  };

  return (
    <div className="session-container">
      {loader ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <div className="session-header">
          <h1 className="title">Single Session</h1>
          <div className="header-content">
            <div className="grid-item">
              <span className="label">Cohort name:</span>
              <span>{session?.cohortName || 'Crafters'}</span>
            </div>
            <div className="grid-item status-wrapper">
              <span className="status-label">Session Status:</span>
              <span>
                {session?.status === 'completed'
                  ? 'Completed'
                  : session?.status === 'live'
                  ? 'Live'
                  : session?.status === 'cancelled'
                  ? 'Cancelled'
                  : 'Pending'}
              </span>
            </div>
            <div className="grid-item">
              <span className="label">Session ID:</span>
              <span>{session?.sessionId || 'crafters_s03'}</span>
            </div>
            <div className="grid-item timing-info">
              <span className="label">Session Timing:</span>
              <span>
                {session?.sessionTime || '00:00'} |{' '}
                {session?.timeZone || 'AKST'}
              </span>
            </div>
          </div>


            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active-btn' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="tab-content">{renderTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default TeacherEditSingleSession;
