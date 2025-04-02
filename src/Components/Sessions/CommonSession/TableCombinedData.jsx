import React from 'react';

const TableCombinedData = ({ value, question, checkedIndex, setCheckedIndex, isEditEval }) => {
  const handleCheckboxChange = (index) => {
    setCheckedIndex((prevState) => ({
      ...prevState,
      [value]: {
        ...prevState[value],
        [question]: index
      }
    }));
  };
  return (
    <div>
      <div className="cohort-form-row-2">
        <div className="cohort-form-left">
          <p>{question}</p>
        </div>
        <div className="cohort-form-right ">
          <div className="ses-eval-table-header-flex">
            <input
              type="checkbox"
              checked={checkedIndex === 1}
              onChange={() => handleCheckboxChange(1)}
              disabled={!isEditEval}
            />
            <input
              type="checkbox"
              checked={checkedIndex === 2}
              onChange={() => handleCheckboxChange(2)}
              disabled={!isEditEval}
            />
            <input
              type="checkbox"
              checked={checkedIndex === 3}
              onChange={() => handleCheckboxChange(3)}
              disabled={!isEditEval}
            />
            <input
              type="checkbox"
              checked={checkedIndex === 4}
              onChange={() => handleCheckboxChange(4)}
              disabled={!isEditEval}
            />
            <input
              type="checkbox"
              checked={checkedIndex === 5}
              onChange={() => handleCheckboxChange(5)}
              disabled={!isEditEval}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCombinedData;
