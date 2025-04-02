import React, { useEffect, useState } from 'react';

import './addDistrictAdmin.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useForm } from 'react-hook-form';
import InputField from '../../Common/InputField/InputField';
import InputPhone from '../../Common/InputPhone/InputPhone';
import Constants from '../../../Constants';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import { callAPI, getSessionStorage } from '../../../Helper';
import Notification from '../../Common/Notification/Notification';
import Loader from '../../Common/Loader/Loader';

const AddDistrictAdmin = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset
  } = useForm({ criteriaMode: 'all' });
  const [selectValue, setSelectValue] = useState({});
  const [selectError, setSelectError] = useState(false);
  const [blur, setBlur] = useState(false);
  const [notification, setNotification] = useState({
    iconType: true,
    content: ''
  });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'scroll';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const onSubmit = (data) => {
    // console.log(data);
    const emailLogedUser = JSON.parse(getSessionStorage('user'))?.emailId;
    const addDistrictAdminData = {
      entity: 'district_admin',
      info: {
        ...data,
        ...selectValue,
        createdBy: emailLogedUser
      }
    };
    setLoader(true);
    callAPI(
      'post',
      'https://e5k1yxz18g.execute-api.us-east-1.amazonaws.com/testing/registration',
      addDistrictAdminData
    )
      .then((res) => {
        callAPI(
          'post',
          'https://tos3sqxro1.execute-api.us-east-1.amazonaws.com/testing/adminapproval',
          {
            action: 'add',
            info: {
              uid: res.uid,
              emailId: res.emailId,
              activated: false,
              firstName: data.firstName,
              lastName: data.lastName,
              entity: 'district_admin',
              schoolName: ''
            }
          }
        ).then(() => {
          setNotification({ iconType: true, content: 'Account has been created successfully!' });
          setBlur(true);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          document.body.style.overflow = 'hidden';
          reset();
          setSelectValue({});
          setLoader(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setNotification({
          iconType: false,
          content: 'Account registration failed. Please try again.'
        });
        setBlur(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
  };

  const onError = () => {
    console.log('calling');
    setSelectError(true);
  };

  function setValueBlr(value) {
    setBlur(value);
  }

  return (
    <>
      {blur && (
        <Notification
          icon={notification.iconType}
          data={notification.content}
          blur={blur}
          setBlur={setValueBlr}
        />
      )}
      {loader ? (
        <Loader />
      ) : (
        <div className={blur ? 'activeAddSchool' : ''}>
          <div className="add-teacher-container">
            <BreadcrumbsLink
              breadcrumbValues={{
                1: {
                  name: 'Home',
                  link: '/home'
                },
                2: {
                  name: 'Accounts',
                  link: '/accounts'
                }
              }}
              lastValue={'Add District Admin'}
            />

            <div className="add-teacher-header">
              <h1>Add District Admin</h1>
            </div>

            <div className="add-teacher-main-form">
              <div className="add-teacher-teacher-details">
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                  <div className="flexx add-teacher-form-container">
                    <section className="">
                      <div className="column">
                        <div className="left">
                          <h4>Admin details</h4>
                          <p className="paraDistrict">This user would be POC for this school</p>
                        </div>
                        <div className="internal right">
                          <div className="column">
                            <div className="input-box">
                              <InputField
                                label={'First Name *'}
                                value={'firstName'}
                                register={register}
                                errors={errors}
                                option={{
                                  required: 'This input is required.'
                                }}
                              />
                            </div>
                            <div className="input-box">
                              <InputField
                                label={'Last Name'}
                                value={'lastName'}
                                register={register}
                                errors={errors}
                                option={{}}
                              />
                            </div>
                          </div>
                          <div className="column">
                            <div className="input-box">
                              <div id="phone-number">
                                <label>Phone Number *</label>
                              </div>
                              <InputPhone control={control} errors={errors} />
                            </div>
                            <div className="input-box">
                              <InputField
                                label={'Email ID *'}
                                value={'emailId'}
                                register={register}
                                errors={errors}
                                option={{
                                  required: 'This input is required.',
                                  pattern: {
                                    value:
                                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    message: 'This input is Email only.'
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <br />
                  <hr /> */}
                      {/* <div className="column">
                    <div className="left">
                      <h4>School details</h4>
                    </div>
                    <div className="internal right">
                      <div className="column">
                        <div className="input-box">
                          <InputField
                            label={'School name *'}
                            value={'schoolName'}
                            register={register}
                            errors={errors}
                            option={{
                              required: 'This input is required.'
                            }}
                          />
                        </div>
                        <div className="input-box">
                          <label>School Type</label>
                          <div className="select-box">
                            <SelectInputField
                              options={Constants.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                              selectData={(dataValue) =>
                                setSelectValue({ ...selectValue, schoolType: dataValue })
                              }
                              select={selectValue.schoolType}
                              selectError={selectError}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="input-box">
                          <InputField
                            type={'number'}
                            label={'No. of student accounts *'}
                            value={'noOfStudentAccounts'}
                            register={register}
                            errors={errors}
                            option={{
                              required: 'This input is required.',
                              pattern: {
                                value: /\d+/,
                                message: 'This input is number only.'
                              }
                            }}
                          />
                        </div>
                        <div className="input-box">
                          <InputField
                            type={'number'}
                            label={'No. of teachers accounts *'}
                            value={'noOfTeachersAccounts'}
                            register={register}
                            errors={errors}
                            option={{
                              required: 'This input is required.',
                              pattern: {
                                value: /\d+/,
                                message: 'This input is number only.'
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="column">
                        <div className="input-box">
                          <InputField
                            type={'number'}
                            label={'No. of admin accounts *'}
                            value={'noOfAdminAccounts'}
                            register={register}
                            errors={errors}
                            option={{
                              required: 'This input is required.',
                              pattern: {
                                value: /\d+/,
                                message: 'This input is number only.'
                              }
                            }}
                          />
                        </div>
                        <div className="input-box">
                          <InputField
                            type={'number'}
                            label={'No. of Sessions *'}
                            value={'noofSessions'}
                            register={register}
                            errors={errors}
                            option={{
                              required: 'This input is required.',
                              pattern: {
                                value: /\d+/,
                                message: 'This input is number only.'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                      <br />
                      <hr />
                      <div className="column">
                        <div className="left">
                          <h4>Location details</h4>
                          <p className="paraDistrict">
                            This information is necessary to plan the game sessions
                          </p>
                        </div>
                        <div className="internal right">
                          <div className="column">
                            {/* <div className="input-box">
                          <label>School Type</label>
                          <div className="select-box">
                            <SelectInputField
                              options={Constants.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                              selectData={(dataValue) =>
                                setSelectValue({ ...selectValue, schoolType: dataValue })
                              }
                              select={selectValue.schoolType}
                              selectError={selectError}
                            />
                          </div>
                        </div>
                        <div className="input-box">
                          <label>School Type</label>
                          <div className="select-box">
                            <SelectInputField
                              options={Constants.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                              selectData={(dataValue) =>
                                setSelectValue({ ...selectValue, schoolType: dataValue })
                              }
                              select={selectValue.schoolType}
                              selectError={selectError}
                            />
                          </div>
                        </div> */}
                            <div className="input-box">
                              <InputField
                                label={'District'}
                                value={'district'}
                                register={register}
                                errors={errors}
                                option={{}}
                              />
                              {/* <label>District</label>
                              <div className="select-box">
                                <SelectInputField
                                  options={Constants.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, district: dataValue })
                                  }
                                  select={selectValue.district}
                                  selectError={selectError}
                                />
                              </div> */}
                            </div>
                            <div className="input-box">
                              <label>State</label>
                              <div className="select-box">
                                <SelectInputField
                                  options={Constants.STATES[selectValue.country]}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, state: dataValue })
                                  }
                                  select={selectValue.state}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="input-box exception">
                              <label>Country</label>
                              {/* <input type="text" /> */}
                              <div className="select-box">
                                <SelectInputField
                                  options={Constants.COUNTRY}
                                  selectData={(dataValue) =>
                                    setSelectValue({ ...selectValue, country: dataValue })
                                  }
                                  select={selectValue.country}
                                  selectError={selectError}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <button className="add-school-btn" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDistrictAdmin;
