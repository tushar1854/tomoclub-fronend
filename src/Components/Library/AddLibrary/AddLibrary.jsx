import React, { useState } from 'react';

import './addLibrary.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import AccordianLibrary from '../../Common/AccordianLibrary/AccordianLibrary';
import { callAPI } from '../../../Helper';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';

const AddLibrary = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [numberOfGames, setNumberOfGames] = useState(0);
  const [gamesData, setGamesData] = useState({});

  const handleClick = (e) => {
    setLoader(true);
    e.preventDefault();
    const data = {
      numberOfGames,
      gamesData
    };
    Array.from({ length: numberOfGames }, (_, index) => {
      callAPI('post', 'https://8uyrm0llfk.execute-api.us-east-1.amazonaws.com/testing/game_read', {
        gameName: data.gamesData[`Game_${index + 1}_details`].gameName,
        gameMode: data.gamesData[`Game_${index + 1}_details`].gameMode,
        skill: data.gamesData[`Game_${index + 1}_details`].skill,
        theme: data.gamesData[`Game_${index + 1}_details`].theme,
        csCompetency: data.gamesData[`Game_${index + 1}_details`].csCompetency,
        tcCompetency: data.gamesData[`Game_${index + 1}_details`].tcCompetency
      })
        .then((res) => {
          console.log(res);
          navigate('/library');
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    console.log('data', data);
  };

  return (
    <div className="library1-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Library',
            link: '/library'
          }
        }}
        lastValue={'Add'}
      />

      <div className="accounts-header">
        <h1>Add Game</h1>
      </div>

      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="add-game-container">
            <div className="add-game-sec1">
              <p>Number of games to add</p>
              <input type="number" onChange={(e) => setNumberOfGames(e.target.value)} />
            </div>
            <hr className="hr-library" />
            {Array.from({ length: numberOfGames }, (_, index) => (
              <>
                <AccordianLibrary
                  key={index}
                  name={`Game ${parseInt(index) + 1} details`}
                  setData={(data) => setGamesData({ ...gamesData, ...data })}
                />
                {index === numberOfGames - 1 ? null : <hr className="hr-library" />}
              </>
            ))}
          </div>
          <div className="btn-game" onClick={handleClick}>
            Add games
          </div>
        </>
      )}
    </div>
  );
};

export default AddLibrary;
