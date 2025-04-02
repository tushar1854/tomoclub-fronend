import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useNavigate } from 'react-router-dom';
import './moderator.css';
// import edit from '../../assets/icons/edit.svg';
import Loader from '../Common/Loader/Loader';
import { callAPI } from '../../Helper';

const TableHeader = () => {
  return (
    <div className="TableHeader-cohort-comp">
      <li>Name</li>
      <li>Date Added</li>
      <li>Sessions</li>
      {/* <li className="hidden"></li> */}
      {/* <li>Session evaluation</li> */}
    </div>
  );
};

const TableData = ({ name, createdBy, modId }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-cohort-comp">
      <li
        onClick={() => {
          navigate(`/modview/${modId}`, {
            state: {
              modId
            }
          });
        }}>
        {name}
      </li>
      <li className="">{createdBy}</li>
      <li
        className="blue-list"
        onClick={() =>
          navigate('/moderators/session', {
            state: {
              modId,
              name
            }
          })
        }>
        View
      </li>

      {/* <li>
        <img className="edit-img-cohort" src={edit} alt="edit" />
      </li> */}
    </div>
  );
};
const ModeratorHome = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [moderator, setModerator] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://cy60lxn6el.execute-api.us-east-1.amazonaws.com/testing/moderator_read')
      .then((modData) => {
        console.log(modData);
        setModerator(modData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  return (
    <div className="students-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Students'}
      />
      <div className="accounts-header">
        <div className="add-school-input-box">
          <h1>Experts</h1>
          <div className="mod-add-school-select-box">
            <button
              className="add-new-school-btn"
              type="submit"
              onClick={() => {
                navigate(`/moderators/add`);
              }}>
              + Add Experts
            </button>
          </div>
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div className="mod-table-container">
          <div className="cohort-table-header">
            <TableHeader />
          </div>
          <div className="student-table-body">
            {moderator.map((mod) => (
              <TableData
                key={mod.moderatorUid}
                name={mod.moderatorName}
                createdBy={mod.createdAt?.split(' ')[0]}
                modId={mod.moderatorUid}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorHome;
