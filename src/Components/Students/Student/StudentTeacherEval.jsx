import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { callAPI, getSessionStorage } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import './../../Sessions/Edit/teacher-edit-single-session.scss';

const StudentTeacherEval = () => {
  const location = useLocation();
  const { sessionId: passedSessionId, cohortUid: passedCohortUid } = location.state || {};
  useEffect(() => {
  console.log('🧭 Navigation state received:', { passedSessionId, passedCohortUid });
}, []);

  const [activeTab, setActiveTab] = useState('Students Feedback');
  const [selectedCohort, setSelectedCohort] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [feedbackStudentUid, setFeedbackStudentUid] = useState('');
  const [teacherSessions, setTeacherSessions] = useState([]);
  const [allCohorts, setAllCohorts] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [sessionStatus, setSessionStatus] = useState('');
  const [loader, setLoader] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const isCompleted = sessionStatus === 'completed';

  // Load teacher sessions
  useEffect(() => {
    const user = JSON.parse(getSessionStorage('user'));
    const teacherUid = user?.uid;
    if (!teacherUid) return;

    callAPI('get', `https://zzpq0vmz17.execute-api.us-east-1.amazonaws.com/testing/session-teacher?teacheruid=${teacherUid}`)
      .then((res) => {
        setTeacherSessions(res || []);
        const uniqueCohorts = Array.from(new Set((res || []).map(s => s.cohortName)));
        setAllCohorts(uniqueCohorts);
      })
      .catch((err) => console.error('Failed to load teacher sessions:', err));
  }, []);

  // Load default data if state is passed
  useEffect(() => {
    if (!teacherSessions.length || !passedSessionId || !passedCohortUid) return;

    const session = teacherSessions.find(
      (s) => s.sessionId === passedSessionId && s.cohortUid === passedCohortUid
    );
    if (session) {
      setSelectedCohort(session.cohortName);
      setSelectedSessionId(session.sessionId);
      setSessionStatus(session.status);
    }
  }, [teacherSessions, passedSessionId, passedCohortUid]);

  // Load feedback form based on session selection
  useEffect(() => {
    if (!selectedSessionId || !selectedCohort) return;

    setLoader(true);

    const matchedSession = teacherSessions.find(
      s => s.sessionId === selectedSessionId && s.cohortName === selectedCohort
    );
    const status = matchedSession?.status || '';

    setSessionStatus(status);

    if (status !== 'completed') {
      callAPI('get', 'https://fy82ysdxe3.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_read')
        .then((res) => {
          const updatedQuestions = (res.feedback_form || []).map((q) => ({
            ...q,
            isEditable: q.isEditable || false,
          }));
          setFeedbackQuestions(updatedQuestions);
          setFeedbackStudentUid(res.uid || '');
        })
        .catch((err) => console.error('Feedback form fetch error:', err))
        .finally(() => setLoader(false));
    } else {
      callAPI(
        'get',
        `https://244krp4i50.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_get_answer_count?session_id=${selectedSessionId}`
      )
        .then((res) => {
          if (Array.isArray(res)) {
            setFeedbackQuestions(res);
          } else if (res.feedback_form) {
            setFeedbackQuestions(res.feedback_form);
          } else {
            setFeedbackQuestions([]);
          }
        })
        .catch((err) => console.error('Feedback count fetch error:', err))
        .finally(() => setLoader(false));
    }
  }, [selectedSessionId, selectedCohort]);

  const handleCohortChange = (e) => {
    const cohortName = e.target.value;
    setSelectedCohort(cohortName);
    setSelectedSessionId('');
    setFeedbackQuestions([]);
    const sessions = teacherSessions.filter((s) => s.cohortName === cohortName);
    setFilteredSessions(sessions);
  };

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSessionId(sessionId);
    const session = teacherSessions.find(
      s => s.sessionId === sessionId && s.cohortName === selectedCohort
    );
    if (session) setSessionStatus(session.status);
  };

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
    updated[qIndex].options.forEach(opt => (opt.isCorrect = false));
    updated[qIndex].options[oIndex].isCorrect = true;
    setFeedbackQuestions(updated);
  };

  const handleSubmitFeedbackForm = () => {
    const payload = {
      uid: feedbackStudentUid,
      feedback_form: feedbackQuestions.map(q => ({
        question: q.question,
        isEditable: q.isEditable,
        options: q.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect || false
        }))
      }))
    };

    callAPI('post', 'https://kf7ssh5q05.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_update', payload)
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

  const renderTabs = () => (
    <div className="tabs">
      {['Session Details', 'Reports Status', 'Teacher Feedback', 'Students Feedback'].map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? 'active-btn' : ''}`}
          onClick={() => setActiveTab(tab)}
          disabled={tab !== 'Students Feedback'}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const renderStudentsFeedback = () => {
    if (loader) return <div className="loader-container"><Loader /></div>;
    if (!feedbackQuestions.length) return null;

    return (
      <div className="students-feedback">
        <div className="feedback-content">
          <div className="form-group full-width">
            <label className="form-label">Student Name</label>
            <select
              className="form-control"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">-- Select Student --</option>
              {/* Future student options here */}
            </select>
          </div>

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
                                <div className="option-count-horizontal">{opt.count}</div>
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
                          {isEditMode && q.isEditable && !isCompleted ? (
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
                              />
                            </div>
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
              <button className="btn-secondary" onClick={() => setIsEditMode(true)}>Edit Questions</button>
            ) : (
              <button className="btn-primary" onClick={handleSubmitFeedbackForm}>Submit</button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="addSession">
      <div className="create-curr4-container">
        <BreadcrumbsLink
          breadcrumbValues={{ 1: { name: 'Home', link: '/home' }, 2: { name: 'Session', link: '/session' } }}
          lastValue="Edit Student Feedback"
        />

        <h1 className="title">Single Session</h1>

        <div className="session-header">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cohort Name</label>
              <select className="form-control" value={selectedCohort} onChange={handleCohortChange}>
                <option value="">-- Select Cohort --</option>
                {allCohorts.map((cohort, index) => (
                  <option key={index} value={cohort}>{cohort}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Session ID</label>
              <select className="form-control" value={selectedSessionId} onChange={handleSessionChange}>
                <option value="">-- Select Session ID --</option>
                {filteredSessions.map((session, index) => (
                  <option key={index} value={session.sessionId}>{session.sessionId}</option>
                ))}
              </select>
            </div>
          </div>

          {renderTabs()}
        </div>

        <div className="tab-content">
          {activeTab === 'Students Feedback' && renderStudentsFeedback()}
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherEval;
