import React, { useState } from 'react';
// import { ErrorMessage } from '@hookform/error-message';

import './selectInputField.css';

const SelectInputFieldMod = ({
  options,
  selectData,
  select = '',
  selectError,
  providedList = 'no'
}) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <div
        className="select"
        onClick={(e) => {
          setVisibility(!visibility);
          // setSearch('');
          e.currentTarget.children[0].children[1].innerHTML = visibility
            ? 'arrow_drop_down'
            : 'arrow_drop_up';
        }}>
        <div className="selected-option">
          <span>
            {providedList === 'cohort'
              ? Object.keys(select).length === 0
                ? ''
                : select?.cohortName?.length <= 20
                ? select?.cohortName
                : `${select?.cohortName?.slice(0, 20)}...`
              : providedList === 'school'
              ? Object.keys(select).length === 0
                ? ''
                : select?.length <= 20
                ? select
                : `${select?.slice(0, 20)}...`
              : Object.keys(select).length === 0
              ? ''
              : select?.moderatorName?.length <= 20
              ? select?.moderatorName
              : `${select?.moderatorName?.slice(0, 20)}...`}
            {/* {providedList === 'school' && Object.keys(select).length === 0
              ? ''
              : select?.schoolname?.length <= 20
              ? select?.schoolname
              : `${select?.schoolname?.slice(0, 20)}...`} */}
            {/* {Object.keys(select).length === 0
              ? ''
              : select?.moderatorName?.length <= 20
              ? select?.moderatorName
              : `${select?.moderatorName?.slice(0, 20)}...`} */}
          </span>
          <i className="material-icons">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options">
            <ul>
              {options?.map((option) => {
                return providedList === 'cohort' ? (
                  <li
                    key={option.cohortName}
                    className={select === option ? 'active-option' : null}
                    onClick={() => {
                      selectData(option);
                    }}>
                    {option.cohortName}
                  </li>
                ) : providedList === 'school' ? (
                  <li
                    key={option.schoolname}
                    className={select === option.schoolname ? 'active-option' : null}
                    onClick={() => {
                      selectData(option.schoolname);
                    }}>
                    {option.schoolname}
                  </li>
                ) : (
                  <li
                    key={option.moderatorUid}
                    className={select === option ? 'active-option' : null}
                    onClick={() => {
                      selectData(option);
                    }}>
                    {option.moderatorName}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {selectError && select === '' ? (
        <p className="add-school-error">{`⚠ This input is required.`}</p>
      ) : (
        <></>
      )}
    </>
  );
};

export default SelectInputFieldMod;
