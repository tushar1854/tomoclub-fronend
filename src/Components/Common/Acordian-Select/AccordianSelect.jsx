import React from 'react';
import Select from 'react-select';
import './accordianSelect.css';
import { Controller } from 'react-hook-form';

const AccordianSelect = ({ control, name, options }) => {
  return (
    <div className="">
      {/* <p>Select your flavors</p> */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, name, ref } }) => (
          <Select
            onChange={onChange}
            isMulti
            isSearchable
            options={options}
            className="acc-basic"
            value={value}
            name={name}
            ref={ref}
          />
        )}
        rules={{ required: 'This input is required.' }}
      />
      {/* {selectError ? <p className="add-school-error">{`⚠ This input is required.`}</p> : <></>} */}
    </div>
  );
};

export default AccordianSelect;
