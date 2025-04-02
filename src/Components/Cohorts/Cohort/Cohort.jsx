import React from 'react';
import './cohort.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
const TableHeader = () => {
  return (
    <div className="TableHeader-crafter-comp">
      <li>Student Name</li>
      <li>Attendance</li>
      <li>TCC</li>
      <li>TFS</li>
      <li>RT</li>
      <li>EIJOE</li>
    </div>
  );
};
const TableData = () => {
  return (
    <div className="TableData-crafter-comp">
      <li>Bailey Mathew</li>
      <li id="crafter-present">Present</li>
      <li>8.7</li>
      <li>8.7</li>
      <li>8.7</li>
      <li>8.7</li>
    </div>
  );
};
const Cohort = () => {
  return (
    <div className="crafters-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          }
        }}
        lastValue={'Cohorts'}
      />
      <div className="accounts-header">
        <h1>Crafters</h1>
        <div className="crafters-tag">
          <p className="tachers-tag">
            <span id="teacher-tag">Teachers tagged</span> : Marry Jones | Sheldon Cooper | John Snow
          </p>
        </div>
      </div>

      <div className="crafters-table-container">
        <div className="crafters-table-header">
          <TableHeader />
        </div>
        <div className="crafters-table-body">
          <TableData />
          <TableData />
          <TableData />
          <TableData />
          <TableData />
        </div>
      </div>
    </div>
  );
};

export default Cohort;
