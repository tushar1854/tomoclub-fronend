import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';

import './addSchool.css';
import InputField from '../../Common/InputField/InputField';
import CONSTANTS from '../../../Constants';
import backArrow from '../../../assets/arrow-left-circle.svg';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import Notification from '../../Common/Notification/Notification';
import { callAPI } from '../../../Helper';
import { UserAuth } from '../../../Context/AuthContext';
import InputPhone from '../../Common/InputPhone/InputPhone';
import Loader from '../../Common/Loader/Loader';

const AddSchool = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ criteriaMode: 'all' });
  const [blur, setBlur] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [selectError, setSelectError] = useState(false);
  const [notification, setNotification] = useState({
    iconType: true,
    content: ''
  });
  const { logOut } = UserAuth();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    async function logOutEffect() {
      await logOut();
    }
    logOutEffect();
  }, []);

  const onSubmit = (data) => {
    const addSchoolData = {
      entity: 'school',
      info: {
        ...data,
        ...selectValue,
        createdBy: data.emailId
      }
    };
    setLoader(true);
    callAPI(
      'post',
      'https://e5k1yxz18g.execute-api.us-east-1.amazonaws.com/testing/registration',
      addSchoolData
    )
      .then((res) => {
        setNotification({ iconType: true, content: 'Account has been created successfully!' });
        setBlur(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.body.style.overflow = 'hidden';
        setLoader(false);
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
              entity: 'school',
              schoolName: data.schoolName
            }
          }
        );
        navigate('/sucessPage', {
          state: {
            title: 'We received your bussiness query',
            description:
              'Thank you for reaching out to us. Expect a response within 3-4 bussiness days.'
          }
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

  useEffect(() => {
    document.body.style.overflow = 'scroll';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

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
          <div className="reg-back" onClick={() => navigate('/')}>
            <img id="back-img" src={backArrow} alt="" />
            <h4>Back</h4>
          </div>
          <div className="heading-back">
            <h1 className="back-para">Register a school</h1>
            <p className="back-para">
              Fill out the below form to register your school with TomoClub. Once the form is
              submitted, we would reach out you and provide a quotation. <br />
              Please note that all the fields are mandatory. Looking forward to having you on board
              with us
            </p>
          </div>
          <div className="add-school-main">
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="add-school-flexx add-school-container add-school-form-body">
                <section className="">
                  <div className="add-school-form">
                    <div className="add-school-column">
                      <div className="add-school-left">
                        <h4>Admin Details</h4>
                        <p>This user would be POC for this school</p>
                      </div>
                      <div className="add-school-internal add-school-right">
                        <div className="add-school-column">
                          <div className="add-school-input-box">
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

                          <div className="add-school-input-box">
                            <InputField
                              label={'Last Name'}
                              value={'lastName'}
                              register={register}
                              errors={errors}
                              option={{}}
                            />
                          </div>
                        </div>
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            <div id="phone-number">
                              <label>Phone Number *</label>
                            </div>
                            <InputPhone control={control} errors={errors} />
                          </div>
                          <div className="add-school-input-box">
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
                    <br />
                    <hr />

                    <div className="add-school-column">
                      <div className="add-school-left">
                        <h4>School details</h4>
                      </div>
                      <div className="add-school-internal add-school-right">
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            <InputField
                              label={'School Name *'}
                              value={'schoolName'}
                              register={register}
                              errors={errors}
                              option={{
                                required: 'This input is required.'
                              }}
                            />
                          </div>
                          <div className="add-school-input-box">
                            <label>School Type *</label>
                            <div className="add-school-select-box">
                              <SelectInputField
                                options={CONSTANTS.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                                selectData={(dataValue) =>
                                  setSelectValue({ ...selectValue, schoolType: dataValue })
                                }
                                select={selectValue.schoolType}
                                selectError={selectError}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            <InputField
                              type={'number'}
                              label={'No of student licences *'}
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
                          <div className="add-school-input-box">
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
                        <div className="add-school-column">
                          <div className="add-school-input-box">
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
                          <div className="add-school-input-box">
                            <label>Grades Supported *</label>
                            <div className="add-school-select-box">
                              <SelectInputField
                                options={CONSTANTS.ADD_SCHOOL.SCHOOL_DETAILS.GRADES_SUPPORTED_DATA}
                                selectData={(dataValue) =>
                                  setSelectValue({ ...selectValue, gradesSupported: dataValue })
                                }
                                select={selectValue.gradesSupported}
                                selectError={selectError}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <hr />

                    <div className="add-school-column">
                      <div className="add-school-left">
                        <h4>Location details</h4>
                        <p>This information is necessary to plan the game sessions</p>
                      </div>
                      <div className="add-school-internal add-school-right">
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            <InputField
                              label={'Address Line 1 *'}
                              value={'addressLine1'}
                              register={register}
                              errors={errors}
                              option={{
                                required: 'This input is required.'
                              }}
                            />
                          </div>
                          <div className="add-school-input-box">
                            <InputField
                              label={'Address Line 2'}
                              value={'addressLine2'}
                              register={register}
                              errors={errors}
                              option={{}}
                            />
                          </div>
                        </div>
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            <label>Country *</label>
                            <div className="add-school-select-box">
                              <SelectInputField
                                options={CONSTANTS.COUNTRY}
                                selectData={(dataValue) =>
                                  setSelectValue({ ...selectValue, country: dataValue })
                                }
                                select={selectValue.country}
                                selectError={selectError}
                              />
                            </div>
                          </div>
                          <div className="add-school-input-box">
                            <label>State *</label>
                            <div className="add-school-select-box">
                              <SelectInputField
                                options={CONSTANTS.STATES[selectValue.country]}
                                selectData={(dataValue) =>
                                  setSelectValue({ ...selectValue, state: dataValue })
                                }
                                select={selectValue.state}
                                selectError={selectError}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="add-school-column">
                          <div className="add-school-input-box">
                            {/* <label>District</label>
                            <div className="add-school-select-box"> */}
                            <InputField
                              label={'District'}
                              value={'district'}
                              register={register}
                              errors={errors}
                              option={{}}
                            />
                            {/* <SelectInputField
                                options={CONSTANTS.ADD_SCHOOL.SCHOOL_DETAILS.SCHOOL_TYPE_DATA}
                                selectData={(dataValue) =>
                                  setSelectValue({ ...selectValue, district: dataValue })
                                }
                                select={selectValue.district}
                                selectError={selectError}
                              /> */}
                            {/* </div> */}
                          </div>
                          <div className="add-school-input-box ">
                            <InputField
                              type={'number'}
                              label={'Postal Code *'}
                              value={'postalCode'}
                              register={register}
                              errors={errors}
                              option={{
                                required: 'This input is required.'
                              }}
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
      )}
    </>
  );
};

export default AddSchool;
