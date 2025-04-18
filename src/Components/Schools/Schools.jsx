import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './schools.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import Loader from '../Common/Loader/Loader';
import { callAPI } from '../../Helper';

const TableHeader = () => {
  return (
    <div className="TableHeader-comp-school">
      <li>Name</li>
      <li>No. of Teacher</li>
      <li>No. of Student</li>
      <li>Dated added</li>
    </div>
  );
};

const TableData = ({ title, teachercount, studentcount, dated }) => {
  const navigate = useNavigate();
  return (
    <div className="TableData-comp-school">
      <li
        style={{ cursor: 'pointer' }}
        onClick={() => {
          navigate(`/schools/${title.split(' ').join('_')}`);
        }}
      >
        {title}
      </li>
      <li>{teachercount}</li>
      <li>{studentcount}</li>
      <li>{dated.split(' ')[0]}</li>
    </div>
  );
};

const Schools = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [schoolList, setSchoolList] = useState([]);

  useEffect(() => {
    setLoader(true);
    callAPI('get', `https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo`)
      .then((schoolListAPI) => {
        setSchoolList([...schoolListAPI]);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="students-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              }
            }}
            lastValue={'Schools'}
          />
          <div className="accounts-header">
            <div className="add-school-input-box">
              <h1>Schools</h1>
              <div className="sc-add-school-select-box">
                <button
                  className="add-new-school-btn"
                  type="submit"
                  onClick={() => navigate('/accounts/addschool')}
                >
                  + Add School
                </button>
              </div>
            </div>
          </div>

          <div className="school-table-container">
            <div className="student-table-header">
              <TableHeader />
            </div>
            <div className="student-table-body">
              {schoolList.map((school) => {
                return (
                  <TableData
                    key={school.createdby}
                    title={school.schoolname}
                    dated={school.createdat}
                    teachercount={school.teachercount}
                    studentcount={school.studentcount}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Schools;
