import React, { useEffect, useState } from 'react';
// import './accordian.css';
import { useForm } from 'react-hook-form';

import AccordianSelect from '../Acordian-Select/AccordianSelect';
import SelectInputField from '../SelectInputField/SelectInputField';
import Constants from '../../../Constants';
import SelectInputFieldMod from '../SelectInputFieldMod/SelectInputFieldMod';
import { removeBeforeTime, convertTo24Hour } from '../../../Helper/common';
// import DayOfWeekDateInput from '../../Sessions//GenerateSessions/date.jsx'

const AccordianSession = ({ name, setSession, gameData, moderator, cohortName, defaultDate }) => {
  const {
    // formState: { errors },
    handleSubmit,
    control,
    reset,
    register
  } = useForm({ criteriaMode: 'all' });
  const [show, setShow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [gameMode, setGameMode] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    setSelectValue({
      ...selectValue,
      gameMode: []
    });
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
    let sessionD = {};
    sessionD[cohortName] = {
      sessionId: cohortName,
      sessionModerator: selectValue.moderator.moderatorName,
      date: data.sessionDate,
      time: convertTo24Hour(selectValue.startTime).trim(),
      endTime: convertTo24Hour(selectValue.endTime).trim(),
      timezone: selectValue.timezone,
      gameName: selectValue.gameName,
      gameMode: selectValue.gameMode,
      skillInFocus: data.skillToFocus?.map((skillToFocus) => skillToFocus.value).join(','),
      moderatorUid: selectValue.moderator.moderatorUid
    };
    console.log('sessionData', sessionData);
    setSessionData({ ...sessionD });
    setSelectError(false);
    setSaved(true);
    setSession({ ...sessionD });
    setIsEdit(true);
  };

  const onError = () => {
    setSelectError(true);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {show ? (
        <div className="accordian-closed">
          <div className="accordian-closed-container" onClick={() => setShow(false)}>
            <h4>{`+ ${name} `}</h4>
          </div>
        </div>
      ) : isEdit ? (
        <form className="accordian" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="accordian-left left" onClick={() => setShow(true)}>
            <h4 className="acc-left-head">{`- ${name} `}</h4>
            <p className="acc-left-head-1p">Session ID: ${cohortName}</p>
          </div>
          <div className="accordian-right right">
            <div className="accordian-right-row">
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Experts</p>
                  <p>{sessionData[cohortName]?.sessionModerator}</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Date: </p>
                  <p>{sessionData[cohortName]?.date}</p>
                </div>
                <div className="accordian-flex p-flex">
                  <p>Time: </p>
                  <p>{sessionData[cohortName]?.time}</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Game name: </p>
                  <p> {sessionData[cohortName]?.gameName}</p>
                </div>
                <div className="accordian-flex p-flex">
                  <p>Game mode: </p>
                  <p>{sessionData[cohortName]?.gameMode}</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Skill in focus: </p>
                  <p>{sessionData[cohortName]?.skillInFocus}</p>
                </div>
              </div>
            </div>

            <div className="accordian-right-row">
              <button className="accordian-btn" onClick={() => setIsEdit(false)}>
                Edit
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form className="accordian" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="accordian-left left" onClick={() => setShow(true)}>
            <h4 className="acc-left-head">{`- ${name} `}</h4>
            <p className="acc-left-head-1p">Session ID: {cohortName}</p>
          </div>
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
                      defaultValue={defaultDate}
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
              {saved && <p className="saved-session-tag">Saved !</p>}
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AccordianSession;
