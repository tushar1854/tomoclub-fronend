import React, { useState } from 'react';
import './selectInputField.css';

const SelectInputFieldMod = ({
  options,
  selectData,
  select = '',
  selectError,
  providedList = 'no',
  disabled = false
}) => {
  const [visibility, setVisibility] = useState(false);

  const handleClick = (e) => {
    if (disabled) return; // prevent toggling if disabled
    setVisibility(!visibility);
    e.currentTarget.children[0].children[1].innerHTML = visibility
      ? 'arrow_drop_down'
      : 'arrow_drop_up';
  };

  return (
    <>
      <div
        className={`select ${disabled ? 'disabled-select' : ''}`}
        onClick={handleClick}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}
      >
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
          </span>
          <i className="material-icons">arrow_drop_down</i>
        </div>
        {visibility && !disabled && (
          <div className="options">
            <ul>
              {options?.map((option) => {
                return providedList === 'cohort' ? (
                  <li
                    key={option.cohortName}
                    className={select === option ? 'active-option' : null}
                    onClick={() => selectData(option)}
                  >
                    {option.cohortName}
                  </li>
                ) : providedList === 'school' ? (
                  <li
                    key={option.schoolname}
                    className={select === option.schoolname ? 'active-option' : null}
                    onClick={() => selectData(option.schoolname)}
                  >
                    {option.schoolname}
                  </li>
                ) : (
                  <li
                    key={option.moderatorUid}
                    className={select === option ? 'active-option' : null}
                    onClick={() => selectData(option)}
                  >
                    {option.moderatorName}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {selectError && select === '' && !disabled ? (
        <p className="add-school-error">{`⚠ This input is required.`}</p>
      ) : null}
    </>
  );
};

export default SelectInputFieldMod;
