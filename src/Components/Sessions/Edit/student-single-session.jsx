// // import { useEffect, useState } from 'react';
// // import Constants from '../../../Constants';
// // import { callAPI, getSessionStorage } from '../../../Helper';
// // //import Loader from '../../Common/Loader/Loader';
// // import './teacher-edit-single-session.scss';

// // const StudentSingleSession = ({ session }) => {

// //   const convertTo12Hour = (time24) => {
// //     const [hour, minute] = time24.split(':');
// //     const hourNum = parseInt(hour, 10);
// //     const ampm = hourNum >= 12 ? 'PM' : 'AM';
// //     const hour12 = hourNum % 12 || 12;
// //     return `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
// //   };
// //   console.log('session', session);
// //   const [activeTab, setActiveTab] = useState('Session Details');
// //   const [selectValue, setSelectValue] = useState({
// //     moderator: {
// //       moderatorName: session.sessionModerator || '',
// //       moderatorUid: session.moderatorUid || ''
// //     },
// //     startTime: session.sessionTime || '',
// //     endTime: session.sessionEndTime || '',
// //     timezone: session.timeZone || '',
// //     gameName: session.gameName || '',
// //     gameMode: session.gameMode || '',
// //     skillToFocus: session.skillInFocus
// //   });
// //     const [skills, setSkills] = useState([]);  

// //   useEffect(() => {
// //     if (session) {
// //       setSelectValue((prev) => ({
// //         ...prev,
// //         moderator: {
// //           moderatorName: session.sessionModerator || '',
// //           moderatorUid: session.moderatorUid || ''
// //         },
// //         startTime: convertTo12Hour(session.sessionTime || '00:00'),
// //         endTime: convertTo12Hour(session.sessionEndTime || '00:00'),
// //         timezone: session.timeZone || Constants.TIMEZONE[0],
// //         gameName: session.gameName || '',
// //         gameMode: session.gameMode || '',
// //         skillToFocus: session.skillInFocus || ''
// //       }));
// //     }
// //   }, []); // <-- empty dependency array so it runs once only

// //   useEffect(() => {
// //     if (session.skillInFocus) {
// //       setSkills(session.skillInFocus.split(',').map((skill) => skill.trim()));
// //     } else {
// //       setSkills([]);
// //     }
// //   }, [session.skillInFocus]);

// // const user = JSON.parse(getSessionStorage('user'));
// // const studentUsername = user?.studentusernameprimarykey || '';
// // const sessionId = session?.sessionId;
// // const cohortUid = session?.cohortUid;
// // useEffect(() => {
// //   const storedFlags = JSON.parse(sessionStorage.getItem(`student-submissions-${sessionId}`));
// //   if (storedFlags) {
// //     setHasSubmitted(storedFlags);
// //   }
// // }, [sessionId]);

// // const [originalQuestions, setOriginalQuestions] = useState([]);
// // const [checkinQuestions, setCheckinQuestions] = useState([]);
// // const [reviewQuestions, setReviewQuestions] = useState([]);
// // const [loader, setLoader] = useState(false); // if not already present
// // const [hasSubmitted, setHasSubmitted] = useState({
// //   'Session Check-in': false,
// //   'Session Review': false
// // });


// // useEffect(() => {
// //   const fetchFeedbackQuestions = async () => {
// //     setLoader(true);
// //     try {
// //       const response = await callAPI(
// //         'get',
// //         'https://fy82ysdxe3.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_read'
// //       );

// //       const questions = response?.feedback_form || [];
// //       setOriginalQuestions(questions);
// //       setCheckinQuestions(questions.slice(0, 2));
// //       setReviewQuestions(questions.slice(2));
// //     } catch (error) {
// //       console.error('❌ Error fetching feedback questions:', error);
// //     } finally {
// //       setLoader(false);
// //     }
// //   };

// //   fetchFeedbackQuestions();
// // }, []);

// // const isRatingQuestion = (options, questionText) => {
// //   return (
// //     options.length === 5 &&
// //     options.every(opt => ['1', '2', '3', '4', '5'].includes(opt.text)) ||
// //     questionText.toLowerCase().includes("how are you feeling today")
// //   );
// // };

// // const handleOptionSelect = (questionIndex, optionIndex, isReview = false) => {
// //   const questions = isReview ? [...reviewQuestions] : [...checkinQuestions];
// //   questions[questionIndex].options = questions[questionIndex].options.map((opt, i) => ({
// //     ...opt,
// //     isChosen: i === optionIndex,
// //   }));
// //   isReview ? setReviewQuestions(questions) : setCheckinQuestions(questions);
// // };

// // const prepareFeedbackPayload = (isReviewSubmit) => {
// //   // Rebuild full structure from original questions to ensure correct `isCorrect` source
// //   return originalQuestions.map((originalQ, index) => {
// //     const isCheckin = index < checkinQuestions.length;

// //     // Pick from UI state depending on index
// //     const selectedState = isCheckin ? checkinQuestions : reviewQuestions;
// //     const selectedQ = selectedState.find(q => q.question === originalQ.question);

// //     return {
// //       question: originalQ.question,
// //       isEditable: !isCheckin,
// //       options: originalQ.options.map((opt) => {
// //         const selectedOpt = selectedQ?.options?.find(o => o.text === opt.text);
// //         const isChosen = selectedOpt?.isChosen || false;

// //         // For session checkin submit, force isCorrect = false for review questions
// //         return {
// //           text: opt.text,
// //           isCorrect: isReviewSubmit ? opt.isCorrect : (isCheckin ? opt.isCorrect : false),
// //           isChosen: isChosen
// //         };
// //       })
// //     };
// //   });
// // };

// // const handleSubmitFeedback = async (isReviewSubmit = false) => {
// //   const feedbackForm = isReviewSubmit
// //     ? prepareFeedbackPayload(true).slice(checkinQuestions.length) // review questions only
// //     : prepareFeedbackPayload(false).slice(0, checkinQuestions.length); // check-in questions only

// //   const payload = {
// //     studentUsername,
// //     sessionId,
// //     feedbackForm,
// //     cohortUid,
// //   };

// //   console.log("Submitting Feedback Payload:", payload);

// //   const endpoint = isReviewSubmit
// //     ? 'https://nyjkbp93ni.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_insert'
// //     : 'https://6ugjfoszx0.execute-api.us-east-1.amazonaws.com/testing/student_pre_session_form_submission';

// //   try {
// //     const response = await callAPI('post', endpoint, payload);
// //     console.log("API Success:", response);
// //     alert("✅ Feedback submitted successfully!");

// //     setHasSubmitted((prev) => {
// //       const updated = {
// //         ...prev,
// //         [activeTab]: true,
// //       };
// //       sessionStorage.setItem(`student-submissions-${sessionId}`, JSON.stringify(updated));
// //       return updated;
// //     });
// //   } catch (error) {
// //     console.error("API Error:", error);
// //   }
// // };


// //   const tabs = ['Session Details', 'Session Check-in', 'Session Review'];

// //   const renderSessionDetails = () => {
// //       return (
// //         <div className="session-details">
// //           <div className="form-grid">
// //             {/* Row 1: Session Date & Time */}
// //             <div className="form-group">
// //               <label className="form-label">Session Date</label>
// //               <div className="date-inputs">
// //                 <input
// //                   type="text"
// //                   className="form-control day-input"
// //                   value={session.date?.split('-')[2] || '03'}
// //                   disabled
// //                 />
// //                 <input
// //                   type="text"
// //                   className="form-control month-input"
// //                   value={session.date ? new Date(session.date).toLocaleString('default', { month: 'long' }) : 'December'}
// //                   disabled
// //                 />
// //                 <input
// //                   type="text"
// //                   className="form-control year-input"
// //                   value={session.date ? new Date(session.date).getFullYear() : '2023'}
// //                   disabled
// //                 />
// //               </div>
// //             </div>
    
// //             <div className="form-group">
// //               <label className="form-label">Session Time</label>
// //               <div className="time-inputs">
// //                 <input
// //                   type="text"
// //                   className="form-control time-input"
// //                   value={selectValue.startTime || '11:00am'}
// //                   disabled
// //                 />
// //                 <span className="separator">to</span>
// //                 <input
// //                   type="text"
// //                   className="form-control time-input time-input-left"
// //                   value={selectValue.endTime || '12:00pm'}
// //                   disabled
// //                 />
// //                 <input
// //                   type="text"
// //                   className="form-control timezone-input"
// //                   value={selectValue.timezone || 'PST'}
// //                   disabled
// //                 />
// //               </div>
// //             </div>
    
// //             {/* Row 2: Game Name & Game Mode */}
// //             <div className="form-group game-align">
// //               <label className="form-label">Game Name</label>
// //               <input
// //                 type="text"
// //                 className="form-control"
// //                 value={session.gameName || 'The First Settlers'}
// //                 disabled
// //               />
// //             </div>
    
// //             <div className="form-group game-align">
// //               <label className="form-label">Game Mode</label>
// //               <input
// //                 type="text"
// //                 className="form-control"
// //                 value={session.gameMode || 'Chapter 01 - Normal'}
// //                 disabled
// //               />
// //             </div>
    
// //             {/* Row 3: Skills */}
// //             <div className="form-group full-width">
// //               <label className="form-label">Skills in Focus</label>
// //               <div className="skills-container">
// //                 {Array.isArray(skills) && skills.length > 0
// //                   ? skills.map((skill, index) => (
// //                       <span key={index} className="skill-tag">
// //                         {skill.trim()}
// //                       </span>
// //                     ))
// //                   : session.skillInFocus
// //                   ? session.skillInFocus.split(',').map((skill, index) => (
// //                       <span key={index} className="skill-tag">
// //                         {skill.trim()}
// //                       </span>
// //                     ))
// //                   : <span className="skill-tag">No skills available</span>
// //                 }
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       );    
// //   };

// // const renderQuestionBlock = (questions, isReview = false) => {
// //   return (
// //     <div className="students-feedback">
// //       <div className="feedback-content">
// //         {questions.map((q, qIndex) => (
// //           <div key={qIndex}>
// //             <div className="question-row">
// //               <div className="question-column">
// //                 <label className="form-label-question">{q.question}</label>
// //               </div>
// //               <div className="option-column">
// //                 {isRatingQuestion(q.options, q.question) ? (
// //                   <div className="rating-box-group">
// //                     {q.options.map((opt, oIndex) => (
// //                       <div
// //                         key={oIndex}
// //                         className={`rating-box-student ${opt.isChosen ? 'selected' : ''}`}
// //                         onClick={() => handleOptionSelect(qIndex, oIndex, isReview)}
// //                       >
// //                         <div className="rating-value">{opt.text}</div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <div className="vertical-options">
// //                     {q.options.map((opt, oIndex) => (
// //                       <div key={oIndex} className="option-input-completed-student">
// //                         <span className="option-text">{opt.text}</span>
// //                         <input
// //                           type="checkbox"
// //                           checked={opt.isChosen || false}
// //                           onChange={() => handleOptionSelect(qIndex, oIndex, isReview)}
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //             <hr />
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // const renderSessionCheckin = () => {
// //   if (loader) return <div className="loader-container">Loading...</div>;
// //   if (!checkinQuestions.length) return <div>No questions available.</div>;

// //   return (
// //     <>
// //       {renderQuestionBlock(checkinQuestions, false)}
// //         <div
// //             className="btn-primary"
// //             style={{
// //                 backgroundColor: hasSubmitted['Session Check-in'] ? '#ccc' : '',
// //                 cursor: hasSubmitted['Session Check-in'] ? 'not-allowed' : 'pointer',
// //                 pointerEvents: hasSubmitted['Session Check-in'] ? 'none' : 'auto',
// //                 opacity: hasSubmitted['Session Check-in'] ? 0.6 : 1,
// //             }}
// //             onClick={() => !hasSubmitted['Session Check-in'] && handleSubmitFeedback(false)}
// //             >
// //             Submit
// //         </div>
// //         {hasSubmitted['Session Check-in'] && (
// //           <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>)}
// //     </>
// //   );
// // };

// // const renderSessionReview = () => {
// //   if (loader) return <div className="loader-container">Loading...</div>;
// //   if (!reviewQuestions.length) return <div>No review questions available.</div>;

// //   return (
// //     <>
// //       {renderQuestionBlock(reviewQuestions, true)}
// //       <div
// //         className="btn-primary"
// //         style={{
// //             backgroundColor: hasSubmitted['Session Review'] ? '#ccc' : '',
// //             cursor: hasSubmitted['Session Review'] ? 'not-allowed' : 'pointer',
// //             pointerEvents: hasSubmitted['Session Review'] ? 'none' : 'auto',
// //             opacity: hasSubmitted['Session Review'] ? 0.6 : 1,
// //         }}
// //         onClick={() => !hasSubmitted['Session Review'] && handleSubmitFeedback(false)}
// //         >
// //         Submit
// //         </div>
// //         {hasSubmitted['Session Review'] && (
// //           <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>)}
// //     </>
// //   );
// // };




// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case 'Session Details':
// //         return renderSessionDetails();
// //       case 'Session Check-in':
// //         return renderSessionCheckin();
// //       case 'Session Review':
// //         return renderSessionReview();
// //       default:
// //         return renderSessionDetails();
// //     }
// //   };

// //   return (
// //     <div className="session-container">
// //       {loader ? (
// //         <div className="loader-container">
// //           Loading...
// //         </div>
// //       ) : (
// //         <>
// //           <div className="session-header">
// //           <h1 className="title">Single Session</h1>
// //           <div className="header-content">
// //             <div className="grid-item">
// //               <span className="label">Cohort name:</span>
// //               <span>{session?.cohortName || 'Crafters'}</span>
// //             </div>
// //             <div className="grid-item status-wrapper">
// //               <span className="status-label">Session Status:</span>
// //               <span>
// //                 {session?.status === 'completed'
// //                   ? 'Completed'
// //                   : session?.status === 'live'
// //                   ? 'Live'
// //                   : session?.status === 'cancelled'
// //                   ? 'Cancelled'
// //                   : 'Pending'}
// //               </span>
// //             </div>
// //             <div className="grid-item">
// //               <span className="label">Session ID:</span>
// //               <span>{session?.sessionId || 'crafters_s03'}</span>
// //             </div>
// //             <div className="grid-item timing-info">
// //             </div>
// //           </div>


// //             <div className="tabs">
// //               {tabs.map((tab) => (
// //                 <button
// //                   key={tab}
// //                   className={`tab-button ${activeTab === tab ? 'active-btn' : ''}`}
// //                   onClick={() => setActiveTab(tab)}
// //                 >
// //                   {tab}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="tab-content">{renderTabContent()}</div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default StudentSingleSession;


// import { useEffect, useState } from 'react';
// import Constants from '../../../Constants';
// import { callAPI, getSessionStorage } from '../../../Helper';
// import './teacher-edit-single-session.scss';

// const StudentSingleSession = ({ session }) => {
//   const convertTo12Hour = (time24) => {
//     const [hour, minute] = time24.split(':');
//     const hourNum = parseInt(hour, 10);
//     const ampm = hourNum >= 12 ? 'PM' : 'AM';
//     const hour12 = hourNum % 12 || 12;
//     return `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
//   };

//   const [activeTab, setActiveTab] = useState('Session Details');
//   const [selectValue, setSelectValue] = useState({
//     moderator: {
//       moderatorName: session.sessionModerator || '',
//       moderatorUid: session.moderatorUid || ''
//     },
//     startTime: session.sessionTime || '',
//     endTime: session.sessionEndTime || '',
//     timezone: session.timeZone || '',
//     gameName: session.gameName || '',
//     gameMode: session.gameMode || '',
//     skillToFocus: session.skillInFocus
//   });
//   const [skills, setSkills] = useState([]);

//   useEffect(() => {
//     if (session) {
//       setSelectValue((prev) => ({
//         ...prev,
//         moderator: {
//           moderatorName: session.sessionModerator || '',
//           moderatorUid: session.moderatorUid || ''
//         },
//         startTime: convertTo12Hour(session.sessionTime || '00:00'),
//         endTime: convertTo12Hour(session.sessionEndTime || '00:00'),
//         timezone: session.timeZone || Constants.TIMEZONE[0],
//         gameName: session.gameName || '',
//         gameMode: session.gameMode || '',
//         skillToFocus: session.skillInFocus || ''
//       }));
//     }
//   }, []);

//   useEffect(() => {
//     if (session.skillInFocus) {
//       setSkills(session.skillInFocus.split(',').map((skill) => skill.trim()));
//     } else {
//       setSkills([]);
//     }
//   }, [session.skillInFocus]);

//   const user = JSON.parse(getSessionStorage('user'));
//   const studentUsername = user?.studentusernameprimarykey || '';
//   const sessionId = session?.sessionId;
//   const cohortUid = session?.cohortUid;

//   useEffect(() => {
//     const storedFlags = JSON.parse(sessionStorage.getItem(`student-submissions-${sessionId}`));
//     if (storedFlags) {
//       setHasSubmitted(storedFlags);
//     }
//   }, [sessionId]);

//   //const [originalQuestions, setOriginalQuestions] = useState([]);
//   const [checkinQuestions, setCheckinQuestions] = useState([]);
//   const [reviewQuestions, setReviewQuestions] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [hasSubmitted, setHasSubmitted] = useState({
//     'Session Check-in': false,
//     'Session Review': false
//   });

//   useEffect(() => {
//     const fetchFeedbackQuestions = async () => {
//       setLoader(true);
//       try {
//         const response = await callAPI(
//           'get',
//           'https://fy82ysdxe3.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_read'
//         );

//         const questions = response?.feedback_form || [];
//         // setOriginalQuestions(questions);
//         setCheckinQuestions(questions.slice(0, 2));
//         setReviewQuestions(questions.slice(2));
//       } catch (error) {
//         console.error('❌ Error fetching feedback questions:', error);
//       } finally {
//         setLoader(false);
//       }
//     };

//     fetchFeedbackQuestions();
//   }, []);

//   const isRatingQuestion = (options, questionText) => {
//     return (
//       options.length === 5 &&
//       options.every(opt => ['1', '2', '3', '4', '5'].includes(opt.text)) ||
//       questionText.toLowerCase().includes("how are you feeling today")
//     );
//   };

//   const handleOptionSelect = (questionIndex, optionIndex, isReview = false) => {
//     const questions = isReview ? [...reviewQuestions] : [...checkinQuestions];
//     questions[questionIndex].options = questions[questionIndex].options.map((opt, i) => ({
//       ...opt,
//       isChosen: i === optionIndex,
//     }));
//     isReview ? setReviewQuestions(questions) : setCheckinQuestions(questions);
//   };

//   const handleSubmitFeedback = async (isReviewSubmit = false) => {
//     try {
//       if (!isReviewSubmit) {
//         // ✅ Submit only check-in answers
//         const checkinPayload = {
//           studentUsername,
//           sessionId,
//           cohortUid,
//           feedbackForm: checkinQuestions.map(q => ({
//             question: q.question,
//             isEditable: false,
//             options: q.options.map(opt => ({
//               text: opt.text,
//               isChosen: opt.isChosen || false,
//               isCorrect: false
//             }))
//           }))
//         };

//         await callAPI(
//           'post',
//           'https://6ugjfoszx0.execute-api.us-east-1.amazonaws.com/testing/student_pre_session_form_submission',
//           checkinPayload
//         );

//         // ✅ Fetch back confirmed answers
//         const confirmedCheckin = await callAPI(
//           'get',
//           `https://1mcv8w37ij.execute-api.us-east-1.amazonaws.com/testing/get-presession-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
//         );

//         setCheckinQuestions(confirmedCheckin?.feedback_form || []);

//         const updated = { ...hasSubmitted, [activeTab]: true };
//         sessionStorage.setItem(`student-submissions-${sessionId}`, JSON.stringify(updated));
//         setHasSubmitted(updated);
//         alert('✅ Pre-session feedback submitted!');
//       } else {
//         // ✅ Review submit: merge check-in + review
//         const confirmedCheckin = await callAPI(
//           'get',
//           `https://1mcv8w37ij.execute-api.us-east-1.amazonaws.com/testing/get-presession-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
//         );

//         const fullPayload = {
//           studentUsername,
//           sessionId,
//           cohortUid,
//           feedbackForm: [
//             ...(confirmedCheckin?.feedback_form || []),
//             ...reviewQuestions
//           ]
//         };

//         await callAPI(
//           'post',
//           'https://nyjkbp93ni.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_insert',
//           fullPayload
//         );

//         const allAnswers = await callAPI(
//           'get',
//           `https://2o5h6anmqb.execute-api.us-east-1.amazonaws.com/testing/get-post-session-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
//         );

//         const filteredReview = allAnswers?.feedback_form?.slice(2) || [];
//         setReviewQuestions(filteredReview);

//         const updated = { ...hasSubmitted, [activeTab]: true };
//         sessionStorage.setItem(`student-submissions-${sessionId}`, JSON.stringify(updated));
//         setHasSubmitted(updated);
//         alert('✅ Session review submitted!');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('❌ Something went wrong.');
//     }
//   };

//   const tabs = ['Session Details', 'Session Check-in', 'Session Review'];

//   const renderSessionDetails = () => (
//     <div className="session-details">
//       <div className="form-grid">
//         <div className="form-group">
//           <label className="form-label">Session Date</label>
//           <div className="date-inputs">
//             <input
//               type="text"
//               className="form-control day-input"
//               value={session.date?.split('-')[2] || '03'}
//               disabled
//             />
//             <input
//               type="text"
//               className="form-control month-input"
//               value={session.date ? new Date(session.date).toLocaleString('default', { month: 'long' }) : 'December'}
//               disabled
//             />
//             <input
//               type="text"
//               className="form-control year-input"
//               value={session.date ? new Date(session.date).getFullYear() : '2023'}
//               disabled
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Session Time</label>
//           <div className="time-inputs">
//             <input
//               type="text"
//               className="form-control time-input"
//               value={selectValue.startTime || '11:00am'}
//               disabled
//             />
//             <span className="separator">to</span>
//             <input
//               type="text"
//               className="form-control time-input time-input-left"
//               value={selectValue.endTime || '12:00pm'}
//               disabled
//             />
//             <input
//               type="text"
//               className="form-control timezone-input"
//               value={selectValue.timezone || 'PST'}
//               disabled
//             />
//           </div>
//         </div>

//         <div className="form-group game-align">
//           <label className="form-label">Game Name</label>
//           <input
//             type="text"
//             className="form-control"
//             value={session.gameName || 'The First Settlers'}
//             disabled
//           />
//         </div>

//         <div className="form-group game-align">
//           <label className="form-label">Game Mode</label>
//           <input
//             type="text"
//             className="form-control"
//             value={session.gameMode || 'Chapter 01 - Normal'}
//             disabled
//           />
//         </div>

//         <div className="form-group full-width">
//           <label className="form-label">Skills in Focus</label>
//           <div className="skills-container">
//             {Array.isArray(skills) && skills.length > 0
//               ? skills.map((skill, index) => (
//                 <span key={index} className="skill-tag">
//                   {skill.trim()}
//                 </span>
//               ))
//               : <span className="skill-tag">No skills available</span>
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderQuestionBlock = (questions, isReview = false) => {
//     const isDisabled = hasSubmitted[activeTab];

//     return (
//       <div className="students-feedback">
//         <div className="feedback-content">
//           {questions.map((q, qIndex) => (
//             <div key={qIndex}>
//               <div className="question-row">
//                 <div className="question-column">
//                   <label className="form-label-question">{q.question}</label>
//                 </div>
//                 <div className="option-column">
//                   {isRatingQuestion(q.options, q.question) ? (
//                     <div className="rating-box-group">
//                       {q.options.map((opt, oIndex) => (
//                         <div
//                           key={oIndex}
//                           className={`rating-box-student ${opt.isChosen ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
//                           onClick={() => !isDisabled && handleOptionSelect(qIndex, oIndex, isReview)}
//                         >
//                           <div className="rating-value">{opt.text}</div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="vertical-options">
//                       {q.options.map((opt, oIndex) => (
//                         <div key={oIndex} className="option-input-completed-student">
//                           <span className="option-text">{opt.text}</span>
//                           <input
//                             type="checkbox"
//                             checked={opt.isChosen || false}
//                             disabled={isDisabled}
//                             onChange={() => !isDisabled && handleOptionSelect(qIndex, oIndex, isReview)}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <hr />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderSessionCheckin = () => {
//     if (loader) return <div className="loader-container">Loading...</div>;
//     if (!checkinQuestions.length) return <div>No questions available.</div>;

//     return (
//       <>
//         {renderQuestionBlock(checkinQuestions, false)}
//         <div
//           className="btn-primary"
//           style={{
//             backgroundColor: hasSubmitted['Session Check-in'] ? '#ccc' : '',
//             cursor: hasSubmitted['Session Check-in'] ? 'not-allowed' : 'pointer',
//             pointerEvents: hasSubmitted['Session Check-in'] ? 'none' : 'auto',
//             opacity: hasSubmitted['Session Check-in'] ? 0.6 : 1,
//           }}
//           onClick={() => !hasSubmitted['Session Check-in'] && handleSubmitFeedback(false)}
//         >
//           Submit
//         </div>
//         {hasSubmitted['Session Check-in'] && (
//           <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>
//         )}
//       </>
//     );
//   };

//   const renderSessionReview = () => {
//     if (loader) return <div className="loader-container">Loading...</div>;
//     if (!reviewQuestions.length) return <div>No review questions available.</div>;

//     return (
//       <>
//         {renderQuestionBlock(reviewQuestions, true)}
//         <div
//           className="btn-primary"
//           style={{
//             backgroundColor: hasSubmitted['Session Review'] ? '#ccc' : '',
//             cursor: hasSubmitted['Session Review'] ? 'not-allowed' : 'pointer',
//             pointerEvents: hasSubmitted['Session Review'] ? 'none' : 'auto',
//             opacity: hasSubmitted['Session Review'] ? 0.6 : 1,
//           }}
//           onClick={() => !hasSubmitted['Session Review'] && handleSubmitFeedback(true)}
//         >
//           Submit
//         </div>
//         {hasSubmitted['Session Review'] && (
//           <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>
//         )}
//       </>
//     );
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'Session Details':
//         return renderSessionDetails();
//       case 'Session Check-in':
//         return renderSessionCheckin();
//       case 'Session Review':
//         return renderSessionReview();
//       default:
//         return renderSessionDetails();
//     }
//   };

//   return (
//     <div className="session-container">
//       {loader ? (
//         <div className="loader-container">
//           Loading...
//         </div>
//       ) : (
//         <>
//           <div className="session-header">
//             <h1 className="title">Single Session</h1>
//             <div className="header-content">
//               <div className="grid-item">
//                 <span className="label">Cohort name:</span>
//                 <span>{session?.cohortName || 'Crafters'}</span>
//               </div>
//               <div className="grid-item status-wrapper">
//                 <span className="status-label">Session Status:</span>
//                 <span>
//                   {session?.status === 'completed'
//                     ? 'Completed'
//                     : session?.status === 'live'
//                       ? 'Live'
//                       : session?.status === 'cancelled'
//                         ? 'Cancelled'
//                         : 'Pending'}
//                 </span>
//               </div>
//               <div className="grid-item">
//                 <span className="label">Session ID:</span>
//                 <span>{session?.sessionId || 'crafters_s03'}</span>
//               </div>
//             </div>

//             <div className="tabs">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`tab-button ${activeTab === tab ? 'active-btn' : ''}`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="tab-content">{renderTabContent()}</div>
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentSingleSession;

import { useEffect, useState } from 'react';
import Constants from '../../../Constants';
import { callAPI, getSessionStorage } from '../../../Helper';
import './teacher-edit-single-session.scss';

const StudentSingleSession = ({ session }) => {
  const convertTo12Hour = (time24) => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
  };

  const [activeTab, setActiveTab] = useState('Session Details');
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
  }, []);

  useEffect(() => {
    if (session.skillInFocus) {
      setSkills(session.skillInFocus.split(',').map((skill) => skill.trim()));
    } else {
      setSkills([]);
    }
  }, [session.skillInFocus]);

  const user = JSON.parse(getSessionStorage('user'));
  const studentUsername = user?.studentusernameprimarykey || '';
  const sessionId = session?.sessionId;
  const cohortUid = session?.cohortUid;

  const [checkinQuestions, setCheckinQuestions] = useState([]);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState({
    'Session Check-in': false,
    'Session Review': false
  });

  const fetchFeedbackQuestions = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        'get',
        'https://fy82ysdxe3.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_read'
      );

      const questions = response?.feedback_form || [];
      setCheckinQuestions(questions.slice(0, 2));
      setReviewQuestions(questions.slice(2));
    } catch (error) {
      console.error('❌ Error fetching feedback questions:', error);
    } finally {
      setLoader(false);
    }
  };

  const checkFormSubmissionStatus = async () => {
    try {
      // Check Pre-session
      const preSessionRes = await callAPI(
        'get',
        `https://1mcv8w37ij.execute-api.us-east-1.amazonaws.com/testing/get-presession-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
      );

      if (preSessionRes?.message === 'No feedback form found for this student') {
        setHasSubmitted(prev => ({ ...prev, 'Session Check-in': false }));
      } else {
        setCheckinQuestions(preSessionRes.feedback_form || []);
        setHasSubmitted(prev => ({ ...prev, 'Session Check-in': true }));
      }

      // Check Post-session
      const postSessionRes = await callAPI(
        'get',
        `https://2o5h6anmqb.execute-api.us-east-1.amazonaws.com/testing/get-post-session-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
      );

      if (postSessionRes?.message === 'No feedback form found for this student') {
        setHasSubmitted(prev => ({ ...prev, 'Session Review': false }));
      } else {
        const filteredReview = postSessionRes.feedback_form?.slice(2) || [];
        setReviewQuestions(filteredReview);
        setHasSubmitted(prev => ({ ...prev, 'Session Review': true }));
      }

    } catch (err) {
      console.error('Error checking form submission status:', err);
    }
  };

  useEffect(() => {
    fetchFeedbackQuestions();
    checkFormSubmissionStatus();
  }, []);

  const isRatingQuestion = (options, questionText) => {
    return (
      options.length === 5 &&
      options.every(opt => ['1', '2', '3', '4', '5'].includes(opt.text)) ||
      questionText.toLowerCase().includes("how are you feeling today")
    );
  };

  const handleOptionSelect = (questionIndex, optionIndex, isReview = false) => {
    const questions = isReview ? [...reviewQuestions] : [...checkinQuestions];
    questions[questionIndex].options = questions[questionIndex].options.map((opt, i) => ({
      ...opt,
      isChosen: i === optionIndex,
    }));
    isReview ? setReviewQuestions(questions) : setCheckinQuestions(questions);
  };

  const handleSubmitFeedback = async (isReviewSubmit = false) => {
    try {
      if (!isReviewSubmit) {
        const checkinPayload = {
          studentUsername,
          sessionId,
          cohortUid,
          feedbackForm: checkinQuestions.map(q => ({
            question: q.question,
            isEditable: false,
            options: q.options.map(opt => ({
              text: opt.text,
              isChosen: opt.isChosen || false,
              isCorrect: false
            }))
          }))
        };

        await callAPI(
          'post',
          'https://6ugjfoszx0.execute-api.us-east-1.amazonaws.com/testing/student_pre_session_form_submission',
          checkinPayload
        );

        const confirmedCheckin = await callAPI(
          'get',
          `https://1mcv8w37ij.execute-api.us-east-1.amazonaws.com/testing/get-presession-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
        );

        setCheckinQuestions(confirmedCheckin?.feedback_form || []);
        setHasSubmitted(prev => ({ ...prev, 'Session Check-in': true }));
        alert('✅ Pre-session feedback submitted!');
      } else {
        const confirmedCheckin = await callAPI(
          'get',
          `https://1mcv8w37ij.execute-api.us-east-1.amazonaws.com/testing/get-presession-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
        );

        const fullPayload = {
          studentUsername,
          sessionId,
          cohortUid,
          feedbackForm: [
            ...(confirmedCheckin?.feedback_form || []),
            ...reviewQuestions
          ]
        };

        await callAPI(
          'post',
          'https://nyjkbp93ni.execute-api.us-east-1.amazonaws.com/testing/student_feedback_form_insert',
          fullPayload
        );

        const allAnswers = await callAPI(
          'get',
          `https://2o5h6anmqb.execute-api.us-east-1.amazonaws.com/testing/get-post-session-feedback-form?student_username=${studentUsername}&session_id=${sessionId}&cohortuid=${cohortUid}`
        );

        const filteredReview = allAnswers?.feedback_form?.slice(2) || [];
        setReviewQuestions(filteredReview);
        setHasSubmitted(prev => ({ ...prev, 'Session Review': true }));
        alert('✅ Session review submitted!');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Something went wrong.');
    }
  };

  const tabs = ['Session Details', 'Session Check-in', 'Session Review'];

  const renderSessionDetails = () => (
    <div className="session-details">
      <div className="form-grid">
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

        <div className="form-group full-width">
          <label className="form-label">Skills in Focus</label>
          <div className="skills-container">
            {Array.isArray(skills) && skills.length > 0
              ? skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.trim()}
                </span>
              ))
              : <span className="skill-tag">No skills available</span>
            }
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionBlock = (questions, isReview = false) => {
    const isDisabled = hasSubmitted[activeTab];

    return (
      <div className="students-feedback">
        <div className="feedback-content">
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <div className="question-row">
                <div className="question-column">
                  <label className="form-label-question">{q.question}</label>
                </div>
                <div className="option-column">
                  {isRatingQuestion(q.options, q.question) ? (
                    <div className="rating-box-group">
                      {q.options.map((opt, oIndex) => (
                        <div
                          key={oIndex}
                          className={`rating-box-student ${opt.isChosen ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                          onClick={() => !isDisabled && handleOptionSelect(qIndex, oIndex, isReview)}
                        >
                          <div className="rating-value">{opt.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="vertical-options">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="option-input-completed-student">
                          <span className="option-text">{opt.text}</span>
                          <input
                            type="checkbox"
                            checked={opt.isChosen || false}
                            disabled={isDisabled}
                            onChange={() => !isDisabled && handleOptionSelect(qIndex, oIndex, isReview)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSessionCheckin = () => {
    if (loader) return <div className="loader-container">Loading...</div>;
    if (!checkinQuestions.length) return <div>No questions available.</div>;

    return (
      <>
        {renderQuestionBlock(checkinQuestions, false)}
        <div
          className="btn-primary"
          style={{
            backgroundColor: hasSubmitted['Session Check-in'] ? '#ccc' : '',
            cursor: hasSubmitted['Session Check-in'] ? 'not-allowed' : 'pointer',
            pointerEvents: hasSubmitted['Session Check-in'] ? 'none' : 'auto',
            opacity: hasSubmitted['Session Check-in'] ? 0.6 : 1,
          }}
          onClick={() => !hasSubmitted['Session Check-in'] && handleSubmitFeedback(false)}
        >
          Submit
        </div>
        {hasSubmitted['Session Check-in'] && (
          <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>
        )}
      </>
    );
  };

  const renderSessionReview = () => {
    if (loader) return <div className="loader-container">Loading...</div>;
    if (!reviewQuestions.length) return <div>No review questions available.</div>;

    return (
      <>
        {renderQuestionBlock(reviewQuestions, true)}
        <div
          className="btn-primary"
          style={{
            backgroundColor: hasSubmitted['Session Review'] ? '#ccc' : '',
            cursor: hasSubmitted['Session Review'] ? 'not-allowed' : 'pointer',
            pointerEvents: hasSubmitted['Session Review'] ? 'none' : 'auto',
            opacity: hasSubmitted['Session Review'] ? 0.6 : 1,
          }}
          onClick={() => !hasSubmitted['Session Review'] && handleSubmitFeedback(true)}
        >
          Submit
        </div>
        {hasSubmitted['Session Review'] && (
          <div className='mt-2 text-sm text-red-500'> Feedback form submitted</div>
        )}
      </>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Session Details':
        return renderSessionDetails();
      case 'Session Check-in':
        return renderSessionCheckin();
      case 'Session Review':
        return renderSessionReview();
      default:
        return renderSessionDetails();
    }
  };

  return (
    <div className="session-container">
      {loader ? (
        <div className="loader-container">
          Loading...
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

export default StudentSingleSession;
