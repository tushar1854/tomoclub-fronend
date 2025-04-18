import React, { useState } from 'react';
// import { ErrorMessage } from '@hookform/error-message';

import './selectInputField.css';

const SelectInputField = ({
  options,
  selectData,
  select = '',
  selectError,
  providedList = false
}) => {
  const [visibility, setVisibility] = useState(false);
  // const [selectedOption, setSelectedOption] = useState('');
  // console.log('options');
  //   const [search, setSearch] = useState('');
  //   const options = [
  //     'Andaman and Nicobar Islands',
  //     'Andhra Pradesh',
  //     'Arunachal Pradesh',
  //     'Assam',
  //     'Bihar',
  //     'Chandigarh',
  //     'Chhattisgarh',
  //     'Dadra and Nagar Haveli',
  //     'Daman and Diu',
  //     'Delhi',
  //     'Goa',
  //     'Gujarat',
  //     'Haryana',
  //     'Himachal Pradesh',
  //     'Jammu and Kashmir',
  //     'Jharkhand',
  //     'Karnataka',
  //     'Kerala',
  //     'Lakshadweep',
  //     'Madhya Pradesh',
  //     'Maharashtra',
  //     'Manipur',
  //     'Meghalaya',
  //     'Mizoram',
  //     'Nagaland',
  //     'Orissa',
  //     'Pondicherry',
  //     'Punjab',
  //     'Rajasthan',
  //     'Sikkim',
  //     'Tamil Nadu',
  //     'Tripura',
  //     'Uttaranchal',
  //     'Uttar Pradesh',
  //     'West Bengal'
  //   ];
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
        }}
      >
        <div className="selected-option">
          <span
          // title={selectedOption === '' ? '' : selectedOption}
          // {...register(placeholder)}
          >
            {providedList
              ? Object.keys(select).length === 0
                ? ''
                : select?.schoolname?.length <= 20
                ? select?.schoolname
                : `${select?.schoolname?.slice(0, 20)}...`
              : select === ''
              ? ''
              : select.length <= 20
              ? select
              : `${select.slice(0, 20)}...`}
          </span>
          <i className="material-icons">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options">
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
              {options?.map((option) => {
                return providedList ? (
                  <li
                    key={option.schoolname}
                    className={select === option ? 'active-option' : null}
                    onClick={() => {
                      selectData(option);
                    }}
                  >
                    {option.schoolname}
                  </li>
                ) : (
                  <li
                    key={option}
                    className={select === option ? 'active-option' : null}
                    onClick={() => {
                      selectData(option);
                    }}
                  >
                    {option}
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

export default SelectInputField;
