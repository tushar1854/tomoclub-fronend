import React, { useState } from 'react';
import './selectInputAcc.css';

const SelectInputAcc = ({ options, selectData, select = '', selectError }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <div
        className="select-acc"
        onClick={(e) => {
          setVisibility(!visibility);
          e.currentTarget.children[0].children[1].innerHTML = visibility
            ? 'arrow_drop_down'
            : 'arrow_drop_up';
        }}>
        <div className="selected-option-acc">
          <div className="selected-option-2-acc">
            {select === '' ? '' : select.length <= 20 ? select : `${select.slice(0, 20)}...`}
          </div>
          <i className="material-icons-acc">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options">
            <ul>
              {options.map((option) => (
                <li
                  key={option}
                  className={select === option ? 'active-option' : null}
                  onClick={() => {
                    selectData(option);
                  }}>
                  {option}
                </li>
              ))}
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

export default SelectInputAcc;
