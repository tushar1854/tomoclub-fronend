import React from 'react';

const TableCombinedHeader = ({ title }) => {
  return (
    <div>
      <div className="cohort-form-row-2">
        <div className="cohort-form-left">
          <h4>{title}</h4>
        </div>
        <div className="cohort-form-right ">
          <div className="ses-eval-table-header-flex">
            <div className="ses-eval-table-header">
              <h4>1</h4>
              <h4>Novice</h4>
            </div>
            <div className="ses-eval-table-header">
              <h4>2</h4>
              <h4>Emerging</h4>
            </div>
            <div className="ses-eval-table-header">
              <h4>3</h4>
              <h4>Competent</h4>
            </div>
            <div className="ses-eval-table-header">
              <h4>4</h4>
              <h4>Accomplished</h4>
            </div>
            <div className="ses-eval-table-header">
              <h4>5</h4>
              <h4>Exemplary</h4>
            </div>
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </div>
  );
};

export default TableCombinedHeader;
