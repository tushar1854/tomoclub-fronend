import React from 'react';
import Select from 'react-select';
import './multiple-select-cohort.css';
// import { Controller } from 'react-hook-form';

const MultipleSelectCohort = ({ name, options, defaultValue = '', setSetter }) => {
  return (
    <div className="Select-Multi">
      {/* <Controller
        // control={control}
        name={name}
        render={({ field: { value, name, ref } }) => ( */}
      <Select
        onChange={(e) => {
          console.log(e);
          setSetter(e);
        }}
        isMulti
        isSearchable
        options={options}
        className="basic"
        // value={value}
        defaultValue={defaultValue}
        name={name}
        // ref={ref}
      />
      {/* )}
        // rules={{ required: 'This input is required.' }}
      /> */}
    </div>
  );
};

export default MultipleSelectCohort;
