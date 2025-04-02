import React, { useEffect, useState } from 'react';

import './accounts.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
import SelectNavigation from '../Common/SelectNavigation/SelectNavigation';
import Constants from '../../Constants';
import prev from '../../assets/icons/prev.svg';
import next from '../../assets/icons/next.svg';
import SelectInputAcc from '../Common/SelectInputAcc/SelectInputAcc';
import Loader from '../Common/Loader/Loader';
import { callAPI, getSessionStorage } from '../../Helper';
// import { mergeArrays } from '../../Helper/common';

const TableHeader = ({ filter, setFilter }) => {
  return (
    <div className="TableHeader-acc-comp">
      <li id="sharp">Account Name</li>
      <li>
        <div>
          <SelectInputAcc
            options={Constants.ACCOUNTS}
            selectData={(dataValue) => setFilter({ ...filter, account: dataValue })}
            select={filter.account === '' ? 'Account Type' : `Account Type ${filter.account}`}
            // selectError={selectError}
          />
        </div>
      </li>
      <li id="sharp">School Name</li>
      <li>
        <div id="acc-head-exe">
          <SelectInputAcc
            options={Constants.STATUS}
            selectData={(dataValue) => setFilter({ ...filter, status: dataValue })}
            select={filter.status === '' ? 'Status' : `Status ${filter.status}`}
            // selectError={selectError}
          />
        </div>
      </li>
    </div>
  );
};
const TableData = ({ list, setSubmitApprovalList }) => {
  const [isActive, setIsActive] = useState(list.activated);
  const [title, setTitle] = useState(list.activated ? 'Active' : 'Inactive');

  const handleClick = () => {
    setIsActive((current) => !current);
    {
      if (title === 'Active') {
        setTitle('Inactive');
      } else {
        setTitle('Active');
      }
      setSubmitApprovalList({ ...list, activated: !isActive });
    }
  };

  return (
    <div className="TableData-acc-comp">
      <li>{list.firstName + ' ' + list.lastName}</li>
      <li>{list.entity}</li>
      <li>{list.schoolName}</li>
      <li
        className="cursor"
        style={{
          color: isActive ? 'green' : 'red'
        }}
        onDoubleClick={handleClick}>
        {title}
      </li>
    </div>
  );
};

const Accounts = () => {
  const [filter, setFilter] = useState({
    account: '',
    status: ''
  });
  const [loader, setLoader] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [filterApprovalList, setFilterApprovalList] = useState([]);
  const [submitApprovalList, setSubmitApprovalList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getApproval();
  }, [page]);

  // const filterApprovalList = approvalList.find((item) => {
  //   return item.entity === filter.account || item.activated === (filter.status === 'active');
  // });

  const handleSubmit = () => {
    setLoader(true);
    callAPI(
      'post',
      'https://tos3sqxro1.execute-api.us-east-1.amazonaws.com/testing/adminapproval',
      {
        action: 'update',
        info: submitApprovalList
      }
    ).then(() => {
      getApproval();
      // setLoader(false);
      // window.location.reload();
    });
  };

  const getApproval = () => {
    const emailLogedUser = JSON.parse(getSessionStorage('user'))?.emailId;
    setLoader(true);
    callAPI(
      'get',
      `https://r2vgah04x5.execute-api.us-east-1.amazonaws.com/testing/getadmindata?type=read&emailId=${emailLogedUser}&page=${page}`
    )
      .then((approvalListAPI) => {
        if (approvalListAPI.Message === 'No Data Found') {
          setPage((curr) => curr - 1);
          return;
        }
        // setApprovalList([...approvalListAPI]);
        setApprovalList([...approvalListAPI]);
        setFilterApprovalList([...approvalListAPI]);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const setSumbitApproval = (newApprovalList) => {
    let editedList = submitApprovalList.filter((item) => item.uid !== newApprovalList.uid);
    setSubmitApprovalList([...editedList, newApprovalList]);
  };

  useEffect(() => {
    if (approvalList.length > 0) {
      const filterApproval = approvalList.filter((item) => {
        if (filter.account != '' && filter.status != '') {
          return (
            item.entity === filter.account.toLowerCase().split(' ').join('_') &&
            (item.activated ? 'active' : 'inactive') === filter.status.toLowerCase()
          );
        } else {
          return (
            item.entity === filter.account.toLowerCase().split(' ').join('_') ||
            (item.activated ? 'active' : 'inactive') === filter.status.toLowerCase()
          );
        }
      });
      console.log(filterApproval);
      console.log(approvalList);
      setFilterApprovalList(filterApproval);
    }
  }, [filter]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="acc-page">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              }
            }}
            lastValue={'Accounts'}
          />
          <div className="accounts-header">
            <div className="add-school-input-box">
              <h1>Add Accounts</h1>
              <div className="acc-add-school-select-box">
                <SelectNavigation options={Constants.ADD_ACCOUNT.TOMOADMIN_OPTION} />
              </div>
            </div>
          </div>

          <div className="acc-table-container">
            <div className="acc-table-header">
              <TableHeader filter={filter} setFilter={(value) => setFilter(value)} />
            </div>
            <div className="acc-table-body">
              {filterApprovalList?.map((list) => (
                <TableData
                  key={list.uid}
                  list={list}
                  setSubmitApprovalList={(newApprovalList) => setSumbitApproval(newApprovalList)}
                />
              ))}
            </div>
            <div className="cohort-pagination-container">
              <div className="cohort-table-pagination">
                <div className="cohort-table-pagination-left">{/* <p>Rows per page: 25</p> */}</div>
                <div className="cohort-table-pagination-right">
                  <div className="cohort-table-right-inner">
                    {/* <p>1 of 6</p> */}
                    <img
                      src={prev}
                      alt=""
                      onClick={() => setPage((curr) => (curr === 1 ? curr : curr - 1))}
                    />
                    <img src={next} alt="" onClick={() => setPage((curr) => curr + 1)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="acc-sub-btn-cont">
            <button className="acc-sub-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Accounts;
