import React, { useEffect, useState } from 'react';

import './navbar.css';
import tomoclub from '../../../assets/Tomoclub.svg';
import homeIcon from '../../../assets/icons/home.svg';
import account from '../../../assets/icons/account.svg';
import session from '../../../assets/icons/session.svg';
import cohorts from '../../../assets/icons/cohorts.svg';
import curriculum from '../../../assets/icons/curriculum.svg';
// import tasks from '../../../assets/icons/tasks.svg';
import moderators from '../../../assets/icons/moderators.svg';
import teachers from '../../../assets/icons/teachers.svg';
import students from '../../../assets/icons/students.svg';
import schools from '../../../assets/icons/schools.svg';
import library from '../../../assets/icons/library.svg';
import { useNavigate } from 'react-router-dom';
import { getSessionStorage } from '../../../Helper';

function extractString(input) {
  const parts = input.split('/').filter((part) => part !== '');

  // Return the first non-empty part, or an empty string if none found
  if (parts.length > 0) {
    return parts[0];
  } else {
    return ''; // Return an empty string if no non-empty part is found
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState({
    name: 'home',
    classActive: true
  });

  const user = JSON.parse(getSessionStorage('user'));

  useEffect(() => {
    setActiveTag({
      name: extractString(window.location.pathname),
      classActive: true
    });
  }, [window.location.pathname]);

  const navigateToActive = (event) => {
    setActiveTag({
      name: event.target.id || extractString(window.location.pathname),
      classActive: true
    });
    navigate(`/${event.target.id || extractString(window.location.pathname)}`);
  };

  return (
    <div className="l-navbar show" id="nav-bar">
      <nav className="nav">
        <div>
          {' '}
          <a href="#" className="nav_logo tomo">
            {' '}
            <span className="nav_logo-name">
              <img src={tomoclub} alt="" />
            </span>
          </a>
          {user?.entity === 'moderator' ? (
            <div className="nav_list">
              <div
                id="session"
                className={
                  activeTag.classActive && activeTag.name === 'session'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="session" src={session} className="nav_icon"></img>{' '}
                <span id="session" className="nav_name">
                  Session
                </span>{' '}
              </div>
              <div
                id="cohorts"
                className={
                  activeTag.classActive && activeTag.name === 'cohorts'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="cohorts" src={cohorts} className="nav_icon"></img>{' '}
                <span id="cohorts" className="nav_name">
                  Cohorts
                </span>{' '}
              </div>
              <div
                id="students"
                className={
                  activeTag.classActive && activeTag.name === 'students'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="students" src={students} className="nav_icon"></img>{' '}
                <span id="students" className="nav_name">
                  Students
                </span>{' '}
              </div>
            </div>
          ) : user?.entity === 'teacher' ? (
            // Teacher view
            <div className="nav_list">
              <div
                id="home"
                className={
                  activeTag.classActive && activeTag.name === 'home'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                <img id="home" src={homeIcon} className="nav_icon" />
                <span id="home" className="nav_name">
                  Home
                </span>
              </div>
              <div
                id="session"
                className={
                  activeTag.classActive && activeTag.name === 'session'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                <img id="session" src={session} className="nav_icon" />
                <span id="session" className="nav_name">
                  Session
                </span>
              </div>
              <div
                id="cohorts"
                className={
                  activeTag.classActive && activeTag.name === 'cohorts'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                <img id="cohorts" src={cohorts} className="nav_icon" />
                <span id="cohorts" className="nav_name">
                  Cohorts
                </span>
              </div>
              <div
                id="students"
                className={
                  activeTag.classActive && activeTag.name === 'students'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                <img id="students" src={students} className="nav_icon" />
                <span id="students" className="nav_name">
                  Students
                </span>
              </div>
              <div
                id="library"
                className={
                  activeTag.classActive && activeTag.name === 'library'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                <img id="library" src={library} className="nav_icon" />
                <span id="library" className="nav_name">
                  Library
                </span>
              </div>
            </div>
          ) : (
            <div className="nav_list">
              <div
                id="home"
                className={
                  activeTag.classActive && activeTag.name === 'home'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="home" src={homeIcon} className="nav_icon "></img>
                <span id="home" className="nav_name">
                  Home
                </span>{' '}
              </div>

              <div
                id="accounts"
                className={
                  activeTag.classActive && activeTag.name === 'accounts'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="accounts" src={account} className="nav_icon"></img>{' '}
                <span id="accounts" className="nav_name">
                  Accounts
                </span>{' '}
              </div>
              <div
                id="schools"
                className={
                  activeTag.classActive && activeTag.name === 'schools'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="schools" src={schools} className="nav_icon"></img>{' '}
                <span id="schools" className="nav_name">
                  Schools
                </span>{' '}
              </div>
              <div
                id="teachers"
                className={
                  activeTag.classActive && activeTag.name === 'teachers'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="teachers" src={teachers} className="nav_icon"></img>{' '}
                <span id="teachers" className="nav_name">
                  Teachers
                </span>{' '}
              </div>
              <div
                id="students"
                className={
                  activeTag.classActive && activeTag.name === 'students'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="students" src={students} className="nav_icon"></img>{' '}
                <span id="students" className="nav_name">
                  Students
                </span>{' '}
              </div>
              <div
                id="moderators"
                className={
                  activeTag.classActive && activeTag.name === 'moderators'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="moderators" src={moderators} className="nav_icon"></img>{' '}
                <span id="moderators" className="nav_name">
                  Experts
                </span>{' '}
              </div>
              <div
                id="cohorts"
                className={
                  activeTag.classActive && activeTag.name === 'cohorts'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="cohorts" src={cohorts} className="nav_icon"></img>{' '}
                <span id="cohorts" className="nav_name">
                  Cohorts
                </span>{' '}
              </div>
              <div
                id="session"
                className={
                  activeTag.classActive && activeTag.name === 'session'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="session" src={session} className="nav_icon"></img>{' '}
                <span id="session" className="nav_name">
                  Session
                </span>{' '}
              </div>

              <div
                id="curriculum"
                className={
                  activeTag.classActive && activeTag.name === 'curriculum'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="curriculum" src={curriculum} className="nav_icon"></img>{' '}
                <span id="curriculum" className="nav_name">
                  Curriculum
                </span>{' '}
              </div>

              {/* <div
              id="tasks"
              className={
                activeTag.classActive && activeTag.name === 'tasks'
                  ? 'nav_link back active'
                  : 'nav_link back'
              }
              onClick={navigateToActive}>
              {' '}
              <img id="tasks" src={tasks} className="nav_icon"></img>{' '}
              <span id="tasks" className="nav_name">
                Tasks
              </span>{' '}
            </div> */}

              {/* <div
              id="teachers"
              className={
                activeTag.classActive && activeTag.name === 'teachers'
                  ? 'nav_link back active'
                  : 'nav_link back'
              }
              onClick={navigateToActive}>
              {' '}
              <img id="teachers" src={teachers} className="nav_icon"></img>{' '}
              <span id="teachers" className="nav_name">
                Teachers
              </span>{' '}
            </div> */}

              <div
                id="library"
                className={
                  activeTag.classActive && activeTag.name === 'library'
                    ? 'nav_link back active'
                    : 'nav_link back'
                }
                onClick={navigateToActive}
              >
                {' '}
                <img id="library" src={library} className="nav_icon"></img>{' '}
                <span id="library" className="nav_name">
                  Library
                </span>{' '}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
