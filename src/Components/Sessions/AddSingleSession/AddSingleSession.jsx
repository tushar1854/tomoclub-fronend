import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import SelectFieldSession from '../../Common/SelectFieldSession/SelectFieldSession';
import { useForm } from 'react-hook-form';
import { callAPI, convertTo24Hour } from '../../../Helper';
import SelectInputFieldMod from '../../Common/SelectInputFieldMod/SelectInputFieldMod';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import AccordianSelect from '../../Common/Acordian-Select/AccordianSelect';
import Constants from '../../../Constants';
import Loader from '../../Common/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { removeBeforeTime } from '../../../Helper/common';

const AddSingleSession = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset, register } = useForm({ criteriaMode: 'all' });
  const [saved, setSaved] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [gameMode, setGameMode] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cohortList, setCohortList] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [moderator, setModerator] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read')
      .then((res) => {
        console.log(res);
        setCohortList(res);
      })
      .catch((error) => {
        console.log(error);
      });
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
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
    const sessionD = {
      cohortUid: selectValue.cohort.cohortUid,
      info: {
        [`${selectValue.cohort.cohortName}_s${parseInt(selectValue?.cohort?.plannedSessions) + 1}`]:
          {
            sessionId: `${selectValue.cohort.cohortName}_s${
              parseInt(selectValue?.cohort?.plannedSessions) + 1
            }`,
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
      'https://ovlzwl8vvi.execute-api.us-east-1.amazonaws.com/testing/session-insert',
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
          lastValue={'Create session'}
        />

        <div className="accounts-header">
          <h1> Create a Session</h1>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            {selectValue?.cohort?.day ? (
              <div className="session-head-desc">
                <div className="desc-column">
                  <div className="left-desc">
                    <p className="first-p">Experts:</p>
                    <p>{selectValue?.cohort?.moderator}</p>
                  </div>
                  <div className="right-desc">
                    <p className="first-p"> Cohort Timing:</p>{' '}
                    <p>
                      {selectValue?.cohort?.day} | {selectValue?.cohort?.time} |{' '}
                      {selectValue?.cohort?.timeZone}
                    </p>
                  </div>
                </div>
                <div className="desc-column">
                  <div className="left-desc">
                    <p className="first-p">Planned Sessions: </p>
                    <p>{selectValue?.cohort?.plannedSessions}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="create-curr4-form-container">
              <form className="" onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="cohort-form-row-2">
                  <div className="cohort-form-left">
                    <h4>Generate sessions for cohort</h4>
                  </div>
                  <div className="cohort-form-right">
                    <p>Cohort name</p>
                    <div className="generate-session-input">
                      <SelectFieldSession
                        options={cohortList}
                        selectData={(dataValue) =>
                          setSelectValue({ ...selectValue, cohort: dataValue })
                        }
                        select={selectValue.cohort}
                        selectError={selectError}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                {selectValue?.cohort?.day ? (
                  <>
                    <div className="cohort-form-row-2">
                      <div className="accordian-left left">
                        <div className="flex-sess">
                          <h4 className="acc-left-head">{`${name} `}</h4>
                          <p className="acc-left-head-1p">
                            Session ID:{' '}
                            {`${selectValue.cohort.cohortName}_s${
                              parseInt(selectValue?.cohort?.plannedSessions) + 1
                            }`}
                          </p>
                        </div>
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
                          {saved && <p className="saved-session-tag">Saved !</p>}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSingleSession;
