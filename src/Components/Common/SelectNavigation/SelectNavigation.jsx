import React, { useState } from 'react';

import './selectNavigation.css';
import { useNavigate } from 'react-router-dom';

const SelectNavigation = ({ options }) => {
  const [visibility, setVisibility] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div
        className="select-navigation newSelect-navigation"
        onClick={(e) => {
          setVisibility(!visibility);
          // setSearch('');
          e.currentTarget.children[0].children[1].innerHTML = visibility
            ? 'arrow_drop_down'
            : 'arrow_drop_up';
        }}
      >
        <div className="selected-option-navigation">
          <span
          // title={selectedOption === '' ? '' : selectedOption}
          // {...register(placeholder)}
          >
            {/* {select === '' ? '' : select.length <= 20 ? select : `${select.slice(0, 20)}...`} */}
            <p className="selectP-navigation">Add Account</p>
          </span>
          <i className="material-icons-navigation">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options-navigation">
            {/* <div className="search-options">
            <input
              type="text"
              placeholder="Search states"
              defaultValue={search}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div> */}
            <ul>
              {options
                //   .filter((option) => option.toLowerCase().includes(search.toLowerCase()))
                .map((option) => (
                  <li
                    key={option}
                    // className={select === option ? 'active-option-navigation' : null}
                    onClick={() => {
                      navigate(option[1]);
                    }}
                  >
                    {option[0]}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      {/* {selectError && select === '' ? (
        <p className="add-school-error">{`⚠ This input is required.`}</p>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default SelectNavigation;
