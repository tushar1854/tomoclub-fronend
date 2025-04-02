import React, { useEffect, useState } from 'react';
import './curriculum.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import CurriculumA from '../../assets/curriculumA.svg';
import Loader from '../Common/Loader/Loader';
import { callAPI, capitalizeFirstChar } from '../../Helper';

import duplicate from '../../assets/icons/duplicate.svg';
import { useNavigate } from 'react-router-dom';
const TableHeader = () => {
  return (
    <div className="TableHeader-curriculum2-comp">
      <li>Curriculum ID</li>
      <li>No. Sessions</li>
      <li>Created on</li>
      <li>Preset name</li>
      <li className="cur-wid">Assigned to</li>
      <li className="hidden"></li>
    </div>
  );
};
const TableData = ({ assignedTo, createdAt, curriculumUid, nameOfPreset, noOfSessions }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-curriculum2-comp">
      <li>{curriculumUid.substring(0, 4)}</li>
      <li>{noOfSessions}</li>
      <li>{createdAt.split(' ')[0]}</li>
      <li>{capitalizeFirstChar(nameOfPreset)}</li>
      <li className="cur-wid">{assignedTo}</li>

      <li
        className="edit"
        onClick={() =>
          navigate('/curriculum/edit', {
            state: {
              curriculumUid: curriculumUid,
              noOfSessions: noOfSessions,
              nameOfPreset: nameOfPreset
            }
          })
        }>
        <img className="edit-img" src={duplicate} alt="" />
      </li>
    </div>
  );
};

const Curriculum = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [curriculumAll, seCurriculumAll] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://rglyy43j7a.execute-api.us-east-1.amazonaws.com/testing/curriculum_data')
      .then((curriculumAllData) => {
        console.log(curriculumAllData);
        seCurriculumAll(curriculumAllData);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  return (
    <div className="curriculum1-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Curriculum'}
      />
      <div className="accounts-header">
        <h1> Curriculum</h1>
      </div>
      <div className="curriculum1-btn-div">
        <button className="curriculum1-btn" onClick={() => navigate('/curriculum/add')}>
          + Add Preset
        </button>
      </div>
      {loader ? (
        <Loader />
      ) : curriculumAll.length > 0 ? (
        <div className="curriculum2-table">
          <div className="curriculum2-table-header">
            <TableHeader />
          </div>
          <div className="curriculum2-table-body">
            {curriculumAll.map((curriculum) => (
              <TableData
                key={curriculum.curriculumUid}
                assignedTo={curriculum.assignedTo}
                createdAt={curriculum.createdAt}
                curriculumUid={curriculum.curriculumUid}
                nameOfPreset={curriculum.nameOfPreset}
                noOfSessions={curriculum.noOfSessions}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="curriculum1-main">
          <img src={CurriculumA} alt="" />
          <p>No curriculum added yet. Please start by adding a new curriculum preset</p>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
