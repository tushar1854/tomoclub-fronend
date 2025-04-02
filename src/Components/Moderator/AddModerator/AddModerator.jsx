import React, { useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import InputField from '../../Common/InputField/InputField';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import { Controller, useForm } from 'react-hook-form';
import CONSTANTS from '../../../Constants';
import Scheduler from '../../Common/Calender/Scheduler';
import { ErrorMessage } from '@hookform/error-message';
import PhoneInput from 'react-phone-input-2';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';
import { useNavigate } from 'react-router-dom';

const AddModerator = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ criteriaMode: 'all' });
  const [selectValue, setSelectValue] = useState({});
  const [selectError] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [availability, setAvailability] = useState({
    sunday: { available: true, slots: [] },
    monday: { available: true, slots: [] },
    tuesday: { available: true, slots: [] },
    wednesday: { available: true, slots: [] },
    thursday: { available: true, slots: [] },
    friday: { available: true, slots: [] },
    saturday: { available: true, slots: [] }
  });

  const handleAvailabilityToggle = (day) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], available: !availability[day].available }
    });
  };

  const handleTimeSlotChange = (day, slots) => {
    setAvailability({ ...availability, [day]: { ...availability[day], slots: slots } });
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      ...selectValue,
      ...availability
    };
    console.log('Combined Form Data:', formData);
    setLoader(true);
    callAPI(
      'post',
      'https://60pavyr4n6.execute-api.us-east-1.amazonaws.com/testing/moderator-insert',
      formData
    ).then((res) => {
      callAPI(
        'post',
        'https://tos3sqxro1.execute-api.us-east-1.amazonaws.com/testing/adminapproval',
        {
          action: 'add',
          info: {
            uid: res.uid,
            emailId: formData.email,
            activated: false,
            firstName: formData.firstName,
            lastName: formData.lastName,
            entity: 'moderator',
            schoolName: ''
          }
        }
      ).then(() => {
        setLoader(false);
        navigate('/moderators');
      });
    });
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="add-teacher-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: { name: 'Home', link: '/home' },
              2: { name: 'Accounts', link: '/accounts' }
            }}
            lastValue={'Add Experts'}
          />
          <div className="accounts-header">
            <div className="add-school-input-box">
              <h1>Add Experts</h1>
            </div>
          </div>
          <div className="add-teacher-main-form">
            <div className="add-teacher-teacher-details">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flexx add-teacher-form-container">
                  <section className="teacher-section">
                    <div className="column">
                      <div className="left">
                        <h4>Personal details</h4>
                      </div>
                      <div className="internal right">
                        <div className="column">
                          <div className="input-box">
                            <InputField
                              label={'First Name *'}
                              value={'firstName'}
                              register={register}
                              errors={errors}
                              option={{ required: 'This input is required.' }}
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
                            <InputField
                              label={'Email ID *'}
                              value={'email'}
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
                          <div className="input-box">
                            <div id="phone-number">
                              <label>Phone Number *</label>
                            </div>
                            <Controller
                              name="phoneNumber"
                              control={control}
                              rules={{
                                required: 'This input is required.'
                              }}
                              render={({ field }) => (
                                <PhoneInput specialLabel={''} country={'us'} {...field} />
                              )}
                            />
                            <ErrorMessage
                              errors={errors}
                              name="phoneNumber"
                              render={({ messages }) => {
                                return messages
                                  ? Object.entries(messages).map(([type, message]) => (
                                      <p className="add-school-error" key={type}>
                                        {`⚠ ${message}`}
                                      </p>
                                    ))
                                  : null;
                              }}
                            />
                          </div>
                        </div>
                        <div className="column">
                          <div className="input-box">
                            <label>Country</label>
                            <div className="select-box">
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
                          <div className="input-box">
                            <label>State</label>
                            <div className="select-box">
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
                      </div>
                    </div>
                    <br />
                    <hr />
                    <div className="column">
                      <div className="left">
                        <h4>Availability Schedule</h4>
                      </div>
                      <div className="internal right mod-sc">
                        <div className="input-box">
                          <label>
                            <p className="unaval">TIME ZONE</p>
                          </label>
                          <div className="select-box">
                            <SelectInputField
                              options={CONSTANTS.TIMEZONE}
                              selectData={(dataValue) =>
                                setSelectValue({ ...selectValue, timezone: dataValue })
                              }
                              select={selectValue.timezone}
                              selectError={selectError}
                            />
                          </div>
                        </div>
                        <Scheduler
                          availability={availability}
                          handleAvailabilityToggle={handleAvailabilityToggle}
                          handleTimeSlotChange={handleTimeSlotChange}
                        />
                      </div>
                    </div>
                  </section>
                </div>
                <button className="submit-btn">Add Experts</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddModerator;
