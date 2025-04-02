import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import InputField from '../../Common/InputField/InputField';
import { useForm } from 'react-hook-form';
import { callAPI, capitalizeFirstChar } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
import SelectFieldSession from '../../Common/SelectFieldSession/SelectFieldSession';
import DayOfWeekDateInput from '../../Common/Date/DayOfWeekDateInput';
import { useNavigate } from 'react-router-dom';
import '.././sessions.css';
function GenerateSessions() {
  const navigate = useNavigate();
  const [selectValue, setSelectValue] = useState({});
  const [loader, setLoader] = useState(false);
  const [cohortList, setCohortList] = useState([]);
  const [selectError, setSelectError] = useState(false);
  const [date, setDate] = useState('');

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({ criteriaMode: 'all' });

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://7vz4zwaw90.execute-api.us-east-1.amazonaws.com/testing/cohort_read')
      .then((res) => {
        console.log(res);
        setCohortList(res);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = () => {
    const sessionData = {
      cohortUid: selectValue.cohort.cohortUid,
      startDate: String(date),
      selectedNoOfSessions: parseInt(selectValue.noOfSessions)
    };
    console.log('sessionData', sessionData);
    navigate('/session/add', {
      state: {
        ...sessionData,
        ...selectValue.cohort
      }
    });
    // setLoader(true);
    // callAPI(
    //   'post',
    //   'https://ovlzwl8vvi.execute-api.us-east-1.amazonaws.com/testing/session-insert',
    //   sessionData
    // )
    //   .then((res) => {
    //     console.log(res);
    //     navigate('/session');
    //     setLoader(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    setSelectError(false);
  };

  const onError = () => {
    setSelectError(true);
  };

  return (
    <div className="create-cohort-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Session',
            link: '/session'
          }
        }}
        lastValue={'Generate Sessions'}
      />
      <div className="accounts-header">
        <h1> Generate Sessions</h1>
      </div>
      {selectValue?.cohort?.day ? (
        <div className="session-head-desc">
          <div className="desc-column">
            <div className="left-desc">
              <p className="first-p">Teacher:</p>
              <p>{selectValue?.cohort?.teachers?.replace(/, /g, ' | ')}</p>
            </div>
            <div className="right-desc">
              <p className="first-p"> Cohort Timing:</p>{' '}
              <p>
                {selectValue?.cohort?.day} | {selectValue?.cohort?.time} |{' '}
                {selectValue?.cohort?.timeZone}
              </p>
            </div>
          </div>
          <div className="desc-column">
            <div className="left-desc">
              <p className="first-p">Experts: </p>
              <p>{selectValue?.cohort?.moderator}</p>
            </div>
            <div className="right-desc">
              <p className="first-p">Total Sessions: </p>
              <p>{selectValue?.cohort?.noOfSessions}</p>
            </div>
          </div>
        </div>
      ) : null}
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="create-cohort-form-container">
            <div className="cohort-form-row-2">
              <div className="cohort-form-left">
                <h4>Generate sessions for cohort</h4>
              </div>
              <div className="cohort-form-right">
                <p>Cohort name</p>
                <div className="generate-session-input">
                  <SelectFieldSession
                    options={cohortList}
                    selectData={(dataValue) =>
                      setSelectValue({ ...selectValue, cohort: dataValue })
                    }
                    select={selectValue.cohort}
                    selectError={selectError}
                  />
                </div>
              </div>
            </div>
            <hr />
            {selectValue?.cohort?.day ? (
              <>
                <div className="cohort-form-row-3">
                  <div className="cohort-form-left">
                    <h4>Number of sessions to be planned</h4>
                  </div>
                  <div className="cohort-form-right right-flex">
                    <div>
                      {' '}
                      <p>Number of sessions</p>
                      {/* <InputField/> */}
                      <div className="add-cohort-input-box">
                        <InputField
                          label={''}
                          value={'noOfSessions'}
                          register={register}
                          errors={errors}
                          option={{
                            required: 'This input is required.',
                            min: {
                              value: 1,
                              message: `Quantity cannot exceed 1`
                            },
                            max: {
                              value: selectValue?.cohort?.noOfSessions,
                              message: `Quantity cannot exceed ${selectValue?.cohort?.noOfSessions}`
                            }
                          }}
                          onChange={(e) =>
                            setSelectValue({ ...selectValue, noOfSessions: e?.target?.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cohort-form-row-3">
                  <div className="cohort-form-left">
                    <h4>Reamaining no. of sessions</h4>
                  </div>
                  <div className="cohort-form-right">
                    <p>
                      {/* {selectValue?.cohort && selectValue?.noOfSessions
                        ? parseInt(selectValue?.cohort?.noOfsessions) -
                          parseInt(selectValue?.noOfSessions)
                        : parseInt(selectValue?.cohort?.noOfsessions)} */}
                    </p>
                    <p>
                      {selectValue?.cohort?.noOfSessions && selectValue?.noOfSessions
                        ? selectValue?.cohort?.noOfSessions -
                          selectValue?.noOfSessions -
                          selectValue?.cohort?.plannedSessions
                        : selectValue?.cohort?.noOfSessions - selectValue?.cohort?.plannedSessions}
                    </p>
                  </div>
                </div>

                <hr />
                <div className="cohort-form-row-1">
                  <div className="cohort-form-left">
                    <h4>Sessions start date</h4>
                  </div>
                  <div className="cohort-form-right">
                    <div className="add-cohort-input-box">
                      <DayOfWeekDateInput
                        targetDay={capitalizeFirstChar(selectValue?.cohort?.day)}
                        setData={(data) => setDate(data)}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="create-cohort-submit">
            <button className="create-cohort-submit-btn">Generate Sessions</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default GenerateSessions;
