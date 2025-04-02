import React, { useEffect, useState } from 'react';
import './accordian.css';
import { useForm } from 'react-hook-form';

import AccordianSelect from '../Acordian-Select/AccordianSelect';
import SelectInputField from '../SelectInputField/SelectInputField';

const AccordianCurriculum = ({ name, setSession, gameData }) => {
  const {
    // formState: { errors },
    handleSubmit,
    control,
    reset
  } = useForm({ criteriaMode: 'all' });
  const [show, setShow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [gameMode, setGameMode] = useState([]);
  const [skills, setSkills] = useState([]);

  // useEffect(() => {
  //   const gameName = game.map((item) => item.value).join(', ');
  //   const gameMode = gameData.find((item) => item.gameName === gameName)?.modeAndSkills;
  //   setGameMode(gameMode);
  // }, [game]);

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
    const sessionData = {
      ...data,
      ...selectValue
    };
    console.log('sessionData', sessionData);
    setSelectError(false);
    setSaved(true);
    setSession(sessionData);
  };

  const onError = () => {
    setSelectError(true);
  };

  return (
    <>
      {show ? (
        <div className="accordian-closed">
          <div className="accordian-closed-container" onClick={() => setShow(false)}>
            <h4>{`+ ${name} `}</h4>
          </div>
        </div>
      ) : (
        <form className="accordian" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="accordian-left left" onClick={() => setShow(true)}>
            <h4 className="acc-left-head">{`- ${name} `}</h4>
          </div>
          <div className="accordian-right right">
            <div className="accordian-right-row">
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
                  {/* <AccordianSelect
                    control={control}
                    name={'gameName'}
                    options={gameData.map((item) => {
                      return {
                        label: item.gameName,
                        value: item.gameName
                      };
                    })}
                    setSetter={(data) => setGame(data)}
                    checker={true}
                  />
                  {selectError ? (
                    <p className="add-school-error">{`⚠ This input is required.`}</p>
                  ) : (
                    <></>
                  )} */}
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
                  {/* <AccordianSelect
                    control={control}
                    name={'gameMode'}
                    options={gameMode?.map((item) => {
                      return {
                        label: item.gameMode,
                        value: item.gameMode
                      };
                    })}
                    setSetter={(data) => setGameModeSelect(data)}
                    checker={true}
                  />
                  {selectError ? (
                    <p className="add-school-error">{`⚠ This input is required.`}</p>
                  ) : (
                    <></>
                  )} */}
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

export default AccordianCurriculum;
