import React, { useState } from 'react';
// import './create-cohort.css';
import BreadcrumbsLink from '../Common/BreadcrumbsLink/BreadcrumbsLink';
// import MultipleSelect from '../Common/MultipleSelect/MultipleSelect';
import InputField from '../Common/InputField/InputField';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { callAPI } from '../../Helper';
import Loader from '../Common/Loader/Loader';

function AddCurriculum() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ criteriaMode: 'all' });
  const [nameCheck, setNameCheck] = useState(false);
  const [loader, setLoader] = useState(false);

  const onSubmit = (data) => {
    setLoader(true);
    callAPI(
      'get',
      `https://7nluheb3kb.execute-api.us-east-1.amazonaws.com/testing/check_availability?curriculumName=${data.nameOfPreset}`
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          setNameCheck(true);
        } else {
          setNameCheck(false);
          const lData = {
            ...data
            // createdBy: userEmail,
          };
          console.log('data', lData);
          reset();
          navigate('/curriculum/create', {
            state: {
              noOfSessions: data.noOfSessions,
              nameOfPreset: data.nameOfPreset
            }
          });
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onError = () => {
    console.log('calling');
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
            name: 'Curriculum',
            link: '/curriculum'
          }
        }}
        lastValue={'Add Preset'}
      />
      <div className="accounts-header">
        <h1> Add Preset</h1>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="create-cohort-form-container">
            <div className="cohort-form-row-1">
              <div className="cohort-form-left">
                <h4>Number of sessions you want to create for this curriculum presets.</h4>
              </div>
              <div className="cohort-form-right">
                <p>Number of sessions</p>
                {/* <input type='text' className="cohort-input"/> */}
                <div className="add-cohort-input-box">
                  <InputField
                    label={''}
                    value={'noOfSessions'}
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
            <hr />
            <div className="cohort-form-row-2">
              <div className="cohort-form-left">
                <h4>Name of this curriculum preset.</h4>
              </div>
              <div className="cohort-form-right">
                <p>Name of this curriculum preset.</p>
                {/* <input type='text' className="cohort-input"/> */}
                <div className="add-cohort-input-box">
                  <InputField
                    label={''}
                    value={'nameOfPreset'}
                    register={register}
                    errors={errors}
                    option={{
                      required: 'This input is required.'
                    }}
                  />
                  {nameCheck ? (
                    <p className="add-school-error">{`⚠ Name Already Exist`}</p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {/* <hr /> */}
          </div>
          <div className="create-cohort-submit">
            <button className="create-cohort-submit-btn">Create Preset</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddCurriculum;
