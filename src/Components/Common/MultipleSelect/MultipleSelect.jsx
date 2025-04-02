import React from 'react';
import Select from 'react-select';
import './multiple-select.css';
import { Controller } from 'react-hook-form';

const MultipleSelect = ({ control, name, options, checker = false, setSchool }) => {
  // const [flavors, setFlavors] = useState([]);
  // console.log(flavors);
  // [
  //   { label: 'Chocolate', value: 'chocolate' },
  //   { label: 'Strawberry', value: 'strawberry' },
  //   { label: 'Coconut', value: 'coconut' },
  //   { label: 'Vanilla', value: 'vanilla' },
  //   { label: 'Blueberry', value: 'blueberry' },
  //   { label: 'Red Velvet', value: 'velvet' }
  // ]

  return (
    <div className="Select-Multi">
      {checker ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { value, name, ref } }) => (
            <Select
              onChange={(e) => {
                console.log(e);
                setSchool(e);
              }}
              isMulti
              isSearchable
              options={options}
              className="basic"
              value={value}
              name={name}
              ref={ref}
            />
          )}
          // rules={{ required: 'This input is required.' }}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value, name, ref } }) => (
            <Select
              onChange={onChange}
              isMulti
              isSearchable
              options={options}
              className="basic"
              value={value}
              name={name}
              ref={ref}
            />
          )}
          rules={{ required: 'This input is required.' }}
        />
      )}

      {/* <Select
        onChange={(selectedValue) => setFlavors(selectedValue)}
        isMulti
        isSearchable
        options={[
          { label: 'Chocolate', value: 'chocolate' },
          { label: 'Strawberry', value: 'strawberry' },
          { label: 'Coconut', value: 'coconut' },
          { label: 'Vanilla', value: 'vanilla' },
          { label: 'Blueberry', value: 'blueberry' },
          { label: 'Red Velvet', value: 'velvet' }
        ]}
        className="basic"></Select> */}
    </div>
  );
};

export default MultipleSelect;
