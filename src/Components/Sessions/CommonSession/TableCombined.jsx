import React from 'react';
import TableCombinedHeader from './TableCombinedHeader';
import TableCombinedData from './TableCombinedData';

const TableCombined = ({
  title,
  value,
  question1,
  question2,
  question3,
  question4,
  question5,
  evalT,
  setEval,
  isEditEval
}) => {
  return (
    <div>
      <div className="create-cohort-form-container">
        <TableCombinedHeader title={title} />
        <TableCombinedData
          value={value}
          question={question1}
          checkedIndex={evalT[value][question1]}
          setCheckedIndex={setEval}
          isEditEval={isEditEval}
        />
        <hr />
        <TableCombinedData
          value={value}
          question={question2}
          checkedIndex={evalT[value][question2]}
          setCheckedIndex={setEval}
          isEditEval={isEditEval}
        />
        <hr />
        <TableCombinedData
          value={value}
          question={question3}
          checkedIndex={evalT[value][question3]}
          setCheckedIndex={setEval}
          isEditEval={isEditEval}
        />
        <hr />
        <TableCombinedData
          value={value}
          question={question4}
          checkedIndex={evalT[value][question4]}
          setCheckedIndex={setEval}
          isEditEval={isEditEval}
        />
        <hr />
        <TableCombinedData
          value={value}
          question={question5}
          checkedIndex={evalT[value][question5]}
          setCheckedIndex={setEval}
          isEditEval={isEditEval}
        />
      </div>
    </div>
  );
};

export default TableCombined;
