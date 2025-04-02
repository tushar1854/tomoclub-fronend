import React, { useEffect, useState } from 'react';
// import './accordian.css';
import { useForm } from 'react-hook-form';

const AccordianPreviewSession = ({ name, setSession, gameData }) => {
  const {
    // formState: { errors },
    handleSubmit,
    reset
  } = useForm({ criteriaMode: 'all' });
  const [show, setShow] = useState(true);
  const [saved, setSaved] = useState(false);
  const [, setSelectError] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [gameMode, setGameMode] = useState([]);
  const [, setSkills] = useState([]);

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
            <p className="acc-left-head-1p">Session ID: cohort_s01</p>
          </div>
          <div className="accordian-right right">
            <div className="accordian-right-row">
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Experts</p>
                  <p>Mrs. Emily</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Date: </p>
                  <p>13 Jan 2024 </p>
                </div>
                <div className="accordian-flex p-flex">
                  <p> Time: </p>
                  <p>11:00 AM IST</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Game name: </p>
                  <p> BGMI LUDO </p>
                </div>
                <div className="accordian-flex p-flex">
                  <p>Game mode: </p>
                  <p>Hello world</p>
                </div>
              </div>
              <div className="acc-flex">
                <div className="accordian-flex p-flex">
                  <p>Skill in focus: </p>
                  <p>Batsman, All Rounder</p>
                </div>
              </div>
            </div>

            <div className="accordian-right-row">
              <button className="accordian-btn">Edit</button>
              {saved && <p className="saved-session-tag">Saved !</p>}
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AccordianPreviewSession;
