import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { useLocation, useNavigate } from 'react-router-dom';

import './addTeacher.css';
import InputField from '../../Common/InputField/InputField';
import { useForm } from 'react-hook-form';
import InputPhone from '../../Common/InputPhone/InputPhone';
// import SelectInputField from '../../Common/SelectInputField/SelectInputField';
// import Constants from '../../../Constants';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { callAPI } from '../../../Helper';
import Notification from '../../Common/Notification/Notification';
import Loader from '../../Common/Loader/Loader';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import Constants from '../../../Constants';

const AddTeacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [switchTab, setSwitchTab] = useState(true);
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
  const [schoolList, setSchoolList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'scroll';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
      .then((schoolListRes) => {
        setSchoolList(schoolListRes);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        // setNotification({
        //   iconType: false,
        //   content: 'School List API failed. Please try again later'
        // });
        setBlur(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setLoader(false);
      });
  }, []);

  const onSubmit = (data) => {
    // console.log(data);
    const addTeacherData = {
      entity: 'teacher',
      info: {
        ...data,
        createdBy: selectValue.createdby
      }
    };
    setLoader(true);
    callAPI(
      'post',
      'https://e5k1yxz18g.execute-api.us-east-1.amazonaws.com/testing/registration',
      addTeacherData
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
              entity: 'teacher',
              schoolName: selectValue.schoolname
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
        setLoader(false);
      });
  };

  const onError = () => {
    console.log('calling');
    setSelectError(true);
  };

  function setValueBlr(value) {
    setBlur(value);
  }

  const downloadTemplate = (e) => {
    e.preventDefault();
    window.open(Constants.TEACHER_BULK_DOWNLOAD, '_blank');
  };

  const S3_BUCKET = 'bulk-download-template';
  // const REGION = 'Global';

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET }
    // region: REGION
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', async (event) => {
      setSelectedFile(event.target.files[0]);
    });
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleAWSUpload = () => {
    if (selectedFile) {
      try {
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();
        const params = {
          ACL: 'public-read',
          Body: selectedFile,
          Bucket: S3_BUCKET,
          Key:
            selectedFile.name.substring(0, selectedFile.name.length - 4) + '_' + timestamp + '.csv'
        };
        setLoader(true);
        myBucket
          .putObject(params)
          .on('httpUploadProgress', () => {
            setLoader(false);
            setSelectedFile(null);
            // sucess toast
            // redirect to
          })
          .send((err) => {
            setLoader(false);
            if (err) console.log(err);
            // fail toast
          });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

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
              lastValue={'Add teachers'}
            />
            {(location.search === '?activeTab=addTeacher' || location.search === '') && (
              <>
                <div className="add-teacher-header">
                  <h1>Add Teachers</h1>
                </div>

                <div className="add-teacher-main-form">
                  <div className="add-teacher-options">
                    <a
                      onClick={() => navigate('/accounts/addteacher?activeTab=addTeacher')}
                      id="add-teacher-options-active"
                    >
                      Teacher details
                    </a>
                    <a onClick={() => navigate('/accounts/addteacher?activeTab=bulkTeacher')}>
                      Bulk upload
                    </a>
                  </div>
                  <div>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                      <div className="add-teacher-teacher-details ">
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
                                <div className="column">
                                  <div className="input-box">
                                    <InputField
                                      label={'Staff ID'}
                                      value={'staffId'}
                                      register={register}
                                      errors={errors}
                                      option={{}}
                                    />
                                  </div>
                                  <div className="input-box">
                                    <label>School Name*</label>
                                    <div className="select-box">
                                      <SelectInputField
                                        options={schoolList}
                                        selectData={(dataValue) =>
                                          setSelectValue({
                                            ...selectValue,
                                            ...dataValue
                                          })
                                        }
                                        select={selectValue}
                                        selectError={selectError}
                                        providedList={true}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                      <button className="add-school-btn" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
            {location.search === '?activeTab=bulkTeacher' && (
              <>
                <div className="add-teacher-header">
                  <h1>Add Teachers</h1>
                </div>

                <div className="add-teacher-main-form">
                  <div className="add-teacher-options">
                    <a onClick={() => navigate('/accounts/addteacher?activeTab=addTeacher')}>
                      Teacher details
                    </a>
                    <a
                      onClick={() => navigate('/accounts/addteacher?activeTab=bulkTeacher')}
                      id="add-teacher-options-active"
                    >
                      Bulk upload
                    </a>
                  </div>
                  <div className="add-teacher-main-form">
                    <form>
                      <div className="add-teacher-teacher-details ">
                        <div className="flexx add-teacher-form-container">
                          <section className="teacher-section">
                            <div className="bulk-step-1">
                              <h4>Step 1</h4>
                              <p>
                                To add Students details in bulk, please download the following
                                templeate
                              </p>
                              <button className="bulk-btn" onClick={downloadTemplate}>
                                Download Template
                              </button>
                            </div>
                            <br />
                            <hr />
                            <div className="bulk-step-2">
                              <h4>Step 2</h4>
                              <p>After filling the document, upload the document here -</p>
                              <button className="bulk-btn" onClick={handleFileUpload}>
                                Upload filled excel sheet
                              </button>
                              <p>{selectedFile?.name ? selectedFile.name : ''}</p>
                            </div>
                          </section>
                        </div>
                      </div>
                      <button className="add-school-btn" onClick={handleAWSUpload} type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddTeacher;
