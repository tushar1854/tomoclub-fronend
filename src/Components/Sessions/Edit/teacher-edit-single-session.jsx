'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { callAPI, convertTo24Hour, getSessionStorage} from '../../../Helper';
import { removeBeforeTime } from '../../../Helper/common';
import Constants from '../../../Constants';
import Loader from '../../Common/Loader/Loader';
import './teacher-edit-single-session.scss';
import Attendance from '../CommonSession/Attendance';

const TeacherEditSingleSession = ({ session, studentAll }) => {
  console.log('studentAll', studentAll);
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
  //const [singleStudentEval, setSingleStudentEval] = useState('');
  //const [studentListForEval, setStudentListForEval] = useState([]);
  //const [attendanceStu, setAttendanceStu] = useState({});

  //const [attendanceStu, setAttendanceStu] = useState({});
  //const [isEditAttendance, setIsEditAttendance] = useState(true);
  //const [attendanceStuEval, setAttendanceStuEval] = useState({});

  const [feedback, setFeedback] = useState({});
  const [feedbackUid, setFeedbackUid] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [feedbackStudentUid, setFeedbackStudentUid] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const isCompleted = session.status === 'completed';
  useEffect(() => {
    if (activeTab === 'Students Feedback') {
      setLoader(true); // Start loading
      if (session.status !== 'completed') {
        callAPI('get', 'https://fy82ysdxe3.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_read')
          .then((res) => {
            const updatedQuestions = (res.feedback_form || []).map((q) => ({
              ...q,
              isEditable: q.isEditable || false
            }));
            setFeedbackQuestions(updatedQuestions);
            setFeedbackStudentUid(res.uid || '');
          })
          .catch((err) => console.error('Feedback form fetch error:', err))
          .finally(() => setLoader(false)); // End loading
      } else {
        callAPI(
          'get',
          `https://244krp4i50.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_get_answer_count?session_id=${session.sessionId}`
        )
          .then((res) => {
            console.log('✅ Answer count API response:', res);
            if (Array.isArray(res)) {
              setFeedbackQuestions(res);
            } else if (res.feedback_form) {
              setFeedbackQuestions(res.feedback_form);
            } else {
              setFeedbackQuestions([]);
            }
          })
          .catch((err) => console.error('Feedback count fetch error:', err))
          .finally(() => setLoader(false)); // End loading
      }
    }
  }, [activeTab, session.status]);
  

  const handleQuestionChange = (index, value) => {
    const updated = [...feedbackQuestions];
    updated[index].question = value;
    setFeedbackQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...feedbackQuestions];
    updated[qIndex].options[oIndex].text = value;
    setFeedbackQuestions(updated);
  };

  const handleCheckboxChange = (qIndex, oIndex) => {
    const updated = [...feedbackQuestions];
  
    // Uncheck all options first
    updated[qIndex].options.forEach((opt, idx) => {
      updated[qIndex].options[idx].isCorrect = false;
    });
  
    // Then check the selected one
    updated[qIndex].options[oIndex].isCorrect = true;
  
    setFeedbackQuestions(updated);
  };
  
  const handleSubmitFeedbackForm = () => {
    const payload = {
      uid: feedbackStudentUid,
      feedback_form: feedbackQuestions.map((q) => ({
        question: q.question,
        isEditable: q.isEditable,
        options: q.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect || false
        }))
      }))
    };
    console.log('📝 Feedback form payload:', JSON.stringify(payload, null, 2));

    callAPI(
      'post',
      'https://kf7ssh5q05.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_update',
      payload
    )
      .then(() => {
        alert('✅ Feedback form updated!');
        setIsEditMode(false);
      })
      .catch((err) => {
        console.error('❌ Feedback form update error:', err);
        alert('❌ Failed to update feedback form.');
      });
  };

  const isRatingQuestion = (options, questionText) => {
    return (
      (options.length === 5 && options.every(opt => ['1', '2', '3', '4', '5'].includes(opt.text))) ||
      questionText.toLowerCase().includes("how are you feeling today")
    );
  };

  

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
  

  //console.log('Session:', session);
  //console.log('Select Value:', selectValue);

  useEffect(() => {
    if (session.skillInFocus) {
      setSkills(session.skillInFocus.split(',').map((skill) => skill.trim()));
    } else {
      setSkills([]);
    }
  }, [session.skillInFocus]);

  // useEffect(() => {
  //   setLoader(true);
  //   callAPI(
  //     'get',
  //     `https://w2zs50l54d.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${session.sessionId}`
  //   )
  //   .then((res) => {
  //     if (res) {
  //       setAttendanceStu(res.studentInfo_attendance);
  //       setAttendanceStuEval(res.studentInfo_evaluation);
  //     }
  //     setLoader(false);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     setLoader(false);
  //   });
  // }, []);

  useEffect(() => {
    const nextTimes = removeBeforeTime(Constants.TIME, selectValue.startTime);
    if (nextTimes.length > 0) {
      setSelectValue((prev) => ({
        ...prev,
        endTime: nextTimes[0]
      }));
    }
  }, [selectValue.startTime]);

  
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

  const user = JSON.parse(getSessionStorage('user'));

  // ✅ Fetch feedback on tab change or session change
  useEffect(() => {
    if (activeTab === 'Teacher Feedback') {
      setLoader(true);
      const teacherEmail = user?.emailId;
  
      //console.log('Matched Teacher String:', matchedTeacher);
      console.log('✅ Teacher Email Used in API:', teacherEmail);
  
      const sessionId = session?.sessionId;
  
      if (teacherEmail && sessionId) {
        setFeedback({});
        setFeedbackUid('');
        setSubmitted(false);
  
        callAPI(
          'get',
          `https://2djbmnhlsc.execute-api.us-east-1.amazonaws.com/testing/teacher-feedback-read?teacher_emailid=${teacherEmail}&session_id=${sessionId}`
        )
          .then((res) => {
            setFeedback(res.feedbackForm || {});
            setFeedbackUid(res.feedbackFormUid || '');
            setSubmitted(res.submitted || false);
          })
          .catch((err) => console.error('Feedback fetch error:', err))
          .finally(() => setLoader(false)); // ✅ Set loader to false here
      } else {
        setLoader(false); // ✅ Ensure loader is disabled if no API call happens
      }
    }
  }, [activeTab, session]);
  

  // ✅ Handle changes in form input
  const handleFeedbackChange = (question, value) => {
    setFeedback((prev) => ({
      ...prev,
      [question]: value
    }));
  };

  // ✅ Submit Teacher feedback to backend
  const handleFeedbackSubmit = () => {
    const teacherEmailId = user?.emailId;
    const sessionId = session?.sessionId;
    const cohortUid = session?.cohortUid;

    if (!teacherEmailId || !sessionId || !feedbackUid) {
      alert("❗ Missing required teacher or session info.");
      return;
    }

    const payload = {
      teacherEmailId,
      sessionId,
      cohortUid,
      feedbackFormUid: feedbackUid,
      feedbackForm: feedback
    };

    console.log("📝 Feedback to be submitted:", JSON.stringify(payload, null, 2));

    callAPI(
      'post',
      'https://tbtn0cvij8.execute-api.us-east-1.amazonaws.com/testing/teacher-feedback-insert',
      payload
    )
      .then((res) => {
        console.log('✅ Feedback submission success:', res);
        alert('✅ Feedback submitted successfully!');
        setSubmitted(true); // ✅ Update local status after successful submit
      })
      .catch((err) => {
        console.error('❌ Feedback submission error:', err);
        alert('❌ Failed to submit feedback. Please try again.');
      });
  };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const minDate = yesterday.toISOString().split('T')[0];


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
              <label className="form-label">Topics</label>
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
                  min={minDate}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Time</label>
                <div className="time-inputs">
                  {/* <select
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
                  </select> */}

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

  // const renderReportsStatus = () => {
  //     return (
  //         <Attendance
  //           setAttendanceStu={setAttendanceStu}
  //           attendanceStu={attendanceStu}
  //           attendanceStuEval={attendanceStuEval} // optional if you want evaluation link too
  //           students={studentAll}
  //           sessionId={session.sessionId}
  //           isEditAttendance={isEditAttendance}
  //           setIsEditAttendance={setIsEditAttendance}
  //         />
  //     );    
  // };

  const renderReportsStatus = () => {
    return (
      <Attendance
        cohortUid={session.cohortUid}
        sessionId={session.sessionId}
      />
    );
  };

  
  // ✅ Render Teacher Feedback
  const renderTeacherFeedback = () => {
    if (loader) {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }
  
    if (!feedback) return null;
  
    const yesNoQuestions = Object.entries(feedback)
      .filter(([question, value]) => (typeof value === 'string' || typeof value === 'boolean') && question !== 'Remarks');
  
    const ratingQuestions = Object.entries(feedback)
      .filter(([question, value]) => typeof value === 'number' && question !== 'Remarks');
  
    return (
      <div className="teacher-feedback">
        <div className="feedback-form">
        
          <div className="feedback-row-label">
            <span className="feedback-question"></span>
              <div className="feedback-options yes-no">
                  <span className="option-text">Yes</span>
                  <span className="option-text">No</span>
                </div>
              </div>
          {/* ✅ Yes/No Questions */}
          {yesNoQuestions.map(([question]) => (
            <div key={question}>
              <div className="feedback-row">
                <span className="feedback-question">{question}</span>
                <div className="feedback-options yes-no">
                  {['Yes', 'No'].map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        disabled={submitted}
                        checked={feedback[question] === option}
                        onChange={() =>
                          handleFeedbackChange(
                            question,
                            feedback[question] === option ? '' : option
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
              <hr />
            </div>
          ))}

          <div className="feedback-row-label">
            <span className="feedback-question"></span>
              <div className="feedback-options rating">
                  <span className="option-text">1</span>
                  <span className="option-text">2</span>
                  <span className="option-text">3</span>
                  <span className="option-text">4</span>
                  <span className="option-text">5</span>
                </div>
          </div>
  
          {/* ✅ Rating Questions */}
          {ratingQuestions.map(([question]) => (
            <div key={question}>
              <div className="feedback-row">
                <span className="feedback-question">{question}</span>
                <div className="feedback-options rating">
                  {[1, 2, 3, 4, 5].map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        disabled={submitted}
                        checked={feedback[question] === option}
                        onChange={() =>
                          handleFeedbackChange(
                            question,
                            feedback[question] === option ? 0 : option
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
              <hr />
            </div>
          ))}
  
          {/* ✅ Remarks and Submit only shown when not loading */}
          {!loader && (
            <>
              <div className="form-group">
                <label className="form-remark">Remarks</label>
                <textarea
                  className="form-control remarks"
                  value={feedback.Remarks || ''}
                  disabled={submitted}
                  onChange={(e) => handleFeedbackChange('Remarks', e.target.value)}
                  rows={2}
                />
              </div>
  
              {!submitted ? (
                <button className="btn-primary" onClick={handleFeedbackSubmit}>
                  Submit
                </button>
              ) : (
                <p className="submitted-note">Feedback already submitted.</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  const renderStudentsFeedback = () => {
    if (loader) {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }
  
    if (!feedbackQuestions.length) return null;
    
    return (
      <div className="students-feedback">
        <div className="feedback-content">
          {feedbackQuestions.map((q, qIndex) => (
            <div key={qIndex}>
              <div className="question-row">
                <div className="question-column">
                  {isEditMode && q.isEditable && !isCompleted ? (
                    <input
                      type="text"
                      className="form-control"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    />
                  ) : (
                    <label className="form-label-question">{q.question}</label>
                  )}
                </div>
                <div className="option-column">
                  {isRatingQuestion(q.options, q.question) ? (
                    <div className="rating-box-group">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="rating-box">
                          {isEditMode && q.isEditable && !isCompleted ? (
                            <input
                              type="text"
                              className="form-control rating-input"
                              value={opt.text}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            />
                          ) : (
                             <>
                              <div className="rating-value">{opt.text}</div>
                                {typeof opt.count === 'number' && (
                                  <div className="option-count-horizontal">
                                    {opt.count}
                                  </div>
                                )}
                              </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="vertical-options">
                      {q.options.map((opt, oIndex) => (
                        <div
                          key={oIndex}
                          className={!isCompleted ? 'option-input' : 'option-input-completed'}
                        >
                          {isEditMode && q.isEditable && !isCompleted && !isRatingQuestion(q.options, q.question) ? (
                            <>
                              <div className="option-container">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={opt.text}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                />
                                <div
                                  className={`custom-checkbox ${opt.isCorrect ? 'checked' : ''}`}
                                  onClick={() => handleCheckboxChange(qIndex, oIndex)}
                                  role="checkbox"
                                  aria-checked={opt.isCorrect}
                                  tabIndex={0}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="option-text">{opt.text}</span>
                              {typeof opt.count === 'number' && (
                                <span className="option-count-vertical">{opt.count}</span>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                  )}
                </div>
              </div>
              <hr />
            </div>
          ))}

          {!isCompleted && (
            !isEditMode ? (
              <button className="btn-secondary" onClick={() => setIsEditMode(true)}>
                Edit Questions
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmitFeedbackForm}>
                Submit
              </button>
            )
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
