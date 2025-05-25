'use client';

import { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import AccordianSelect from '../../Common/Acordian-Select/AccordianSelect';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { callAPI, convertTo24Hour } from '../../../Helper';
import SelectInputFieldMod from '../../Common/SelectInputFieldMod/SelectInputFieldMod';
import Constants from '../../../Constants';
import Loader from '../../Common/Loader/Loader';
import TableCombined from '../CommonSession/TableCombined';
import Attendance from '../CommonSession/Attendance';
import TextBox from '../../Common/TextBox/TextBox';
import { removeBeforeTime } from '../../../Helper/common';
import TeacherEditSingleSession from './teacher-edit-single-session';
import { getSessionStorage } from '../../../Helper';

const EditSingleSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditSessionDetail, setIsEditSessionDetail] = useState(true);
  const [isEditAttendance, setIsEditAttendance] = useState(true);
  const [isEditEval, setIsEditEval] = useState(true);
  const { handleSubmit, control, reset, register } = useForm({ criteriaMode: 'all' });
  const [saved, setSaved] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [profile, setProfile] = useState(0);
  const [selectValue, setSelectValue] = useState({
    moderator: {
      moderatorName: location.state.session.sessionModerator,
      moderatorUid: location.state.session.moderatorUid
    },
    startTime: location.state.session.time,
    endTime: location.state.session.time,
    timezone: location.state.session.timezone,
    gameName: ''
  });
  const [gameMode, setGameMode] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loader, setLoader] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [moderator, setModerator] = useState([]);
  const [singleStudentEval, setSingleStudentEval] = useState('');
  const [studentListForEval, setStudentListForEval] = useState([]);
  const [studentAll, setStudentAll] = useState([]);
  const [attendanceStu, setAttendanceStu] = useState({});
  const [attendanceStuEval, setAttendanceStuEval] = useState({});
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

  // Get user from session storage
  const user = JSON.parse(getSessionStorage('user'));
  const isTeacher = user?.entity === 'teacher';

  console.log('studentListForEval', studentListForEval);
  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://mslpuh4oe1.execute-api.us-east-1.amazonaws.com/testing/game_name')
      .then((res) => {
        console.log(res);
        setGameData(res);
      })
      .catch((error) => {
        console.log(error);
      });
    callAPI('get', 'https://cy60lxn6el.execute-api.us-east-1.amazonaws.com/testing/moderator_read')
      .then((res) => {
        console.log(res);
        setModerator(res);
      })
      .catch((error) => {
        console.log(error);
      });
    callAPI(
      'get',
      `https://tzxon37yg4.execute-api.us-east-1.amazonaws.com/testing/cohort_specific_read?cohortUid=${location.state.session.cohortUid}`
    )
      .then((res) => {
        console.log(res.students);
        setStudentAll(res.students);
      })
      .catch((error) => {
        console.log(error);
      });
    callAPI(
      'get',
      `https://l8at6mypj6.execute-api.us-east-1.amazonaws.com/testing/evaluation-enables?sessionid=${location.state.session.sessionId}`
    )
      .then((res) => {
        console.log(res);
        setStudentListForEval(res);
      })
      .catch((error) => {
        console.log(error);
      });
    callAPI(
      'get',
      `https://w2zs50l54d.execute-api.us-east-1.amazonaws.com/testing/attendance-read?sessionid=${location.state.session.sessionId}`
    )
      .then((res) => {
        console.log('test', res);
        if (res) {
          setIsEditAttendance(false);
          setAttendanceStu(res.studentInfo_attendance);
          setAttendanceStuEval(res.studentInfo_evaluation);
        } else {
          setIsEditAttendance(true);
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
        `https://ndco3rth29.execute-api.us-east-1.amazonaws.com/testing/evaluation-read?sessionid=${location.state.session.sessionId}`
      )
        .then((res) => {
          console.log(singleStudentEval);
          console.log(res.student[singleStudentEval]);
          if (res.student[singleStudentEval]) {
            setIsEditEval(false);
            setSessionEval(res.student[singleStudentEval]);
          } else {
            setIsEditEval(true);
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
  }, [singleStudentEval]);

  useEffect(() => {
    setSelectValue((prevState) => ({
      ...prevState,
      gameMode: []
    }));
    reset({
      skillToFocus: []
    });
    const gameMode = gameData?.find(
      (item) => item.gameName === selectValue.gameName
    )?.modeAndSkills;
    setGameMode(gameMode);
  }, [selectValue.gameName]);

  useEffect(() => {
    const skills = gameMode?.find((item) => item.gameMode === selectValue.gameMode)?.skills;
    setSkills(skills);
  }, [selectValue.gameMode]);

  const onSubmit = (data) => {
    console.log('selectValue.startTime', [selectValue.startTime]);
    const sessionD = {
      cohortUid: location.state.session.cohortUid,
      info: {
        [location.state.session.sessionId]: {
          sessionId: location.state.session.sessionId,
          sessionModerator: selectValue.moderator.moderatorName,
          date: data.sessionDate,
          time: convertTo24Hour(selectValue.startTime).trim(),
          endTime: convertTo24Hour(selectValue.endTime).trim(),
          timezone: selectValue.timezone,
          gameName: selectValue.gameName,
          gameMode: selectValue.gameMode,
          skillInFocus: data.skillToFocus?.map((skillToFocus) => skillToFocus.value).join(','),
          moderatorUid: selectValue.moderator.moderatorUid
        }
      }
    };
    console.log('sessionD', sessionD);
    setSelectError(false);
    setSaved(true);
    setLoader(true);
    callAPI(
      'post',
      'https://jesicg6quc.execute-api.us-east-1.amazonaws.com/testing/session-update',
      sessionD
    )
      .then((res) => {
        console.log(res);
        navigate('/session');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onError = () => {
    setSelectError(true);
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSessionEval = () => {
    if (isEditEval) {
      console.log('sessionEval', {
        ...sessionEval,
        student: singleStudentEval,
        sessionId: location.state.session.sessionId
      });
      setLoader(true);
      callAPI('post', 'https://jksq4380td.execute-api.us-east-1.amazonaws.com/testing/evaluation', {
        ...sessionEval,
        studentUsername: singleStudentEval,
        sessionId: location.state.session.sessionId
      })
        .then((res) => {
          console.log(res);
          setLoader(false);
          setIsEditEval(!isEditEval);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsEditEval(!isEditEval);
    }
  };

  const handleCancelSession = () => {
    setLoader(true);
    callAPI(
      'post',
      'https://umpsky4wn5.execute-api.us-east-1.amazonaws.com/testing/cancel-session',
      {
        sessionId: location.state.session.sessionId,
        cohortUid: location.state.session.cohortUid,
        cancelled: true
      }
    )
      .then((res) => {
        console.log(res);
        setLoader(false);
        navigate('/session');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // If user is a teacher, render the TeacherEditSingleSession component
  if (isTeacher) {
    return (
      <div className="addSession">
        <div className="create-curr4-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              },
              2: {
                name: 'Session',
                link: '/session'
              }
            }}
            lastValue={'Single session'}
          />
          
        </div>
        <TeacherEditSingleSession session={location.state.session} studentAll={studentAll}/>
      </div>
    );
  }

  // Original component for non-teacher users
  return (
    <>
      <div className="addSession">
        <div className="create-curr4-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              },
              2: {
                name: 'Session',
                link: '/session'
              }
            }}
            lastValue={'Single session'}
          />
          <div className="accounts-header">
            <h1> Single Session</h1>
          </div>
          {loader ? (
            <Loader />
          ) : (
            <>
              <div className="session-head-desc">
                <div className="desc-column">
                  <div className="left-desc">
                    <p className="first-p">Cohort name:</p>{' '}
                    <p>{location.state?.session?.cohortName}</p>
                  </div>
                  <div className="right-desc">
                    <p className="first-p"> Session Status:</p>{' '}
                    <p>{location.state?.session?.status}</p>
                  </div>
                </div>
                <div className="desc-column">
                  <div className="left-desc">
                    <p className="first-p">Session ID:</p>{' '}
                    <p>{location.state?.session?.sessionId}</p>
                  </div>
                  <div className="right-desc">
                    <p className="first-p"> Session Timing:</p>{' '}
                    <p>
                      {location.state?.session?.day} | {location.state?.session?.time} |{' '}
                      {location.state?.session?.timezone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ribbon">
                <div className={profile === 0 ? 'ribbon-item ribbon-item-1' : 'ribbon-item'}>
                  <h4 onClick={() => setProfile(0)}>Session Details</h4>
                </div>
                <div className={profile === 1 ? 'ribbon-item ribbon-item-1' : 'ribbon-item'}>
                  <h4 onClick={() => setProfile(1)}>Session Attendance</h4>
                </div>
                <div className={profile === 2 ? 'ribbon-item ribbon-item-1' : 'ribbon-item'}>
                  <h4 onClick={() => setProfile(2)}>Session Evaluation</h4>
                </div>
              </div>

              {profile === 2 ? (
                <div className="create-cohort-form-container-ses">
                  <div className="sess-student-select">
                    <div className="sess-student-name">
                      <p>Student name: </p>
                    </div>
                    <div className=" sess-input">
                      <SelectInputField
                        options={studentAll}
                        selectData={(dataValue) => setSingleStudentEval(dataValue)}
                        select={singleStudentEval}
                      />
                    </div>
                  </div>
                  {singleStudentEval !== '' && (
                    <>
                      <button
                        className="hanna-eval-btn-1"
                        onClick={() =>
                          window.open(
                            `https://pzjhm1zapg.execute-api.us-east-1.amazonaws.com/testing/evaluation-download?sessionid=${location.state.session.sessionId}`,
                            '_blank'
                          )
                        }
                      >
                        Download Report
                      </button>
                      <TableCombined
                        title={'Leadership'}
                        value={'leadership'}
                        question1={'Initiative Taking and Tenacity'}
                        question2={'Effective Communication'}
                        question3={'Team Player'}
                        question4={'Team Building'}
                        question5={'Strategic Thinking'}
                        evalT={sessionEval}
                        setEval={setSessionEval}
                        isEditEval={isEditEval}
                      />
                      <TableCombined
                        title={'Emotional Intelligence'}
                        value={'emotionalIntelligence'}
                        question1={'Empathy'}
                        question2={'Resilience'}
                        question3={'Social Awareness'}
                        question4={'Emotional Self Awareness'}
                        question5={'Emotional Regulation'}
                        evalT={sessionEval}
                        setEval={setSessionEval}
                        isEditEval={isEditEval}
                      />
                      <TableCombined
                        title={'Innovation'}
                        value={'innovation'}
                        question1={'Creative Thinking'}
                        question2={'Flexibility'}
                        question3={'Curiosity'}
                        question4={'Critical Thinking'}
                        question5={'Risk Taking'}
                        evalT={sessionEval}
                        setEval={setSessionEval}
                        isEditEval={isEditEval}
                      />
                      <TextBox
                        label={'Remark'}
                        value={sessionEval.remark}
                        onChange={(data) => setSessionEval({ ...sessionEval, remark: data })}
                        disabled={!isEditEval}
                      />
                      <button className="session-eval-btn" onClick={handleSessionEval}>
                        {isEditEval ? 'Save' : 'Edit'}
                      </button>
                    </>
                  )}
                </div>
              ) : null}

              {profile === 1 ? (
                <div className="">
                  <Attendance
                    setAttendanceStu={setAttendanceStu}
                    attendanceStu={attendanceStu}
                    attendanceStuEval={attendanceStuEval}
                    students={studentAll}
                    sessionId={location.state.session.sessionId}
                    isEditAttendance={isEditAttendance}
                    setIsEditAttendance={setIsEditAttendance}
                  />
                </div>
              ) : null}

              {profile === 0 ? (
                isEditSessionDetail ? (
                  <div className="create-curr4-form-container">
                    <form className="accordian">
                      <div className="accordian-right right">
                        <div className="accordian-right-row">
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Experts</p>
                              <p>{location.state?.session?.sessionModerator}</p>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Date: </p>
                              <p>{location.state?.session?.date} </p>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Time: </p>
                              <p>
                                {location.state?.session?.sessionTime}{' '}
                                {location.state?.session?.timeZone}
                              </p>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Game name: </p>
                              <p> {location.state?.session?.gameName} </p>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Game mode: </p>
                              <p>{location.state?.session?.gameMode}</p>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex p-flex">
                              <p>Skill in focus: </p>
                              <p>{location.state?.session?.skillInFocus}</p>
                            </div>
                          </div>
                        </div>

                        <div className="accordian-right-row">
                          <button
                            className="accordian-btn"
                            onClick={() => setIsEditSessionDetail(false)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="create-curr4-form-container">
                    <form className="accordian" onSubmit={handleSubmit(onSubmit, onError)}>
                      <div className="accordian-right right">
                        <div className="accordian-right-row">
                          <div className="acc-flex">
                            <div className="accordian-flex">
                              <p>Experts</p>
                              <div className="gameName">
                                <SelectInputFieldMod
                                  options={moderator?.map((item) => item)}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, moderator: dataValue })
                                  }
                                  select={selectValue.moderator}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex">
                              <p>Select Date</p>
                              <div className="gameName">
                                <input
                                  type="date"
                                  {...register('sessionDate', {
                                    required: 'This input is required.'
                                  })}
                                  defaultValue={location.state?.session?.date}
                                  min={today}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="acc-flex">
                            <div className="accordian-flex">
                              <p>Select Start Time</p>
                              <div className="gameName">
                                <SelectInputField
                                  options={Constants.TIME}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, startTime: dataValue })
                                  }
                                  select={selectValue.startTime}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                            <div className="accordian-flex">
                              <p>Select End Time</p>
                              <div className="gameName">
                                <SelectInputField
                                  options={removeBeforeTime(Constants.TIME, selectValue.startTime)}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, endTime: dataValue })
                                  }
                                  select={selectValue.endTime}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                            <div className="accordian-flex">
                              <p>Select Timezone</p>
                              <div className="gameName">
                                <SelectInputField
                                  options={Constants.TIMEZONE}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, timezone: dataValue })
                                  }
                                  select={selectValue.timezone}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="acc-flex">
                            <div className="accordian-flex">
                              <p>Game name</p>
                              <div className="gameName">
                                <SelectInputField
                                  options={gameData?.map((item) => item.gameName)}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, gameName: dataValue })
                                  }
                                  select={selectValue.gameName}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                            <div className="accordian-flex">
                              <p>Game mode</p>
                              <div className="gameName">
                                <SelectInputField
                                  options={gameMode?.map((item) => item.gameMode)}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, gameMode: dataValue })
                                  }
                                  select={selectValue.gameMode}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordian-right-row">
                          <p>Skill in focus</p>
                          <AccordianSelect
                            control={control}
                            name={'skillToFocus'}
                            options={skills?.map((item) => {
                              return {
                                label: item,
                                value: item
                              };
                            })}
                          />
                          {selectError ? (
                            <p className="add-school-error">{`⚠ This input is required.`}</p>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="accordian-right-row">
                          <button className="accordian-btn">Save session</button>
                          <button className="accordian-btn" onClick={handleCancelSession}>
                            Cancel
                          </button>
                          {saved && <p className="saved-session-tag">Saved !</p>}
                        </div>
                      </div>
                    </form>
                  </div>
                )
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditSingleSession;
