import React, { useEffect, useState } from 'react';

import empty from '../../assets/curriculumA.svg';
import './library.css';
import edit from '../../assets/icons/edit.svg';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useNavigate } from 'react-router-dom';
import { callAPI } from '../../Helper';
import Loader from '../Common/Loader/Loader';
const TableHeader = () => {
  return (
    <div className="TableHeader-library1-comp">
      <li>Game name</li>
      <li>Game mode</li>
      <li>Added on</li>
      <li>Skills in focus</li>
      <li>Theme</li>
      <li>TomoClub Competency</li>
      <li className="hidden"></li>
      {/* <li>Session evaluation</li> */}
    </div>
  );
};
const TableData = ({
  uid,
  gameName,
  gameMode,
  skill,
  theme,
  csCompetency,
  tcCompetency,
  createdAt
}) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-library1-comp">
      <li>{gameName}</li>
      <li className="library1-hover">{gameMode}</li>
      <li>{createdAt}</li>
      <li>
        {skill.split(',').map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < skill.split(',').length - 1 && <br />}
          </React.Fragment>
        ))}
      </li>
      <li>{theme}</li>
      <li>{tcCompetency}</li>
      <li
        onClick={() =>
          navigate('/library/edit', {
            state: {
              uid,
              gameName,
              gameMode,
              skill,
              theme,
              csCompetency,
              tcCompetency
            }
          })
        }
      >
        <img className="edit-img-library1" src={edit} alt="edit" />
      </li>
    </div>
  );
};
const Library = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [libraryAll, setLibraryAll] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://8uyrm0llfk.execute-api.us-east-1.amazonaws.com/testing/game_read')
      .then((libraryAllData) => {
        console.log(libraryAllData);
        setLibraryAll(libraryAllData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  return (
    <div className="library1-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Library'}
      />
      <div className="accounts-header">
        <h1>Games</h1>
        <div className="cohort-top-btn">
          <button className="create-cohort-btn" onClick={() => navigate('/library/add')}>
            +Add a Game
          </button>
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : libraryAll.length > 0 ? (
        <div className="library1-table-container">
          <div className="library1-table-header">
            <TableHeader />
          </div>
          <div className="student-table-body">
            {libraryAll.map((library) => (
              <TableData
                key={library.uid}
                uid={library.uid}
                gameName={library.gameName}
                gameMode={library.gameMode}
                skill={library.skill}
                theme={library.theme}
                csCompetency={library.csCompetency}
                tcCompetency={library.tcCompetency}
                createdAt={library.createdAt}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="library-empty-alert">
          <img src={empty} alt="" />
          <h6>No games added yet. Please start by adding a new game.</h6>
        </div>
      )}
    </div>
  );
};

export default Library;
