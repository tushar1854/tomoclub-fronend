import React, { useState } from 'react';

const SelectFieldSession = ({ options, selectData, select = '', selectError }) => {
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
          <span
          // title={selectedOption === '' ? '' : selectedOption}
          // {...register(placeholder)}
          >
            {Object.keys(select).length === 0
              ? ''
              : select?.cohortName?.length <= 20
              ? select?.cohortName
              : `${select?.cohortName?.slice(0, 20)}...`}
          </span>
          <i className="material-icons">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options">
            <ul>
              {options?.map((option) => {
                return (
                  <li
                    key={option.cohortUid}
                    className={select === option ? 'active-option' : null}
                    onClick={() => {
                      selectData(option);
                    }}>
                    {option.cohortName}
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

export default SelectFieldSession;
