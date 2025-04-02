import React, { useEffect, useState } from 'react';
import './create-cohort.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import MultipleSelect from '../../Common/MultipleSelect/MultipleSelect';
import InputField from '../../Common/InputField/InputField';
import { useForm } from 'react-hook-form';
import Constants from '../../../Constants';
import SelectInputField from '../../Common/SelectInputField/SelectInputField';
import { callAPI, convertTo24Hour } from '../../../Helper';
import Loader from '../../Common/Loader/Loader';
import { useNavigate } from 'react-router-dom';

function CreateCohort() {
  const navigate = useNavigate();
  const [selectValue, setSelectValue] = useState({});
  const [selectError, setSelectError] = useState(false);
  // const [multiSelect, setMultiSelect] = useState({});
  const [loader, setLoader] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  // const [curriculumData, setCurriculumData] = useState([]);
  const [schoolName, setSchoolName] = useState([]);
  const [schoolError, setSchoolError] = useState(false);
  const [multiSelectError, setMultiSelectError] = useState({});
  const [teacherStu, setTeacherStu] = useState({
    teacher: [],
    student: []
  });
  const [nameCheck, setNameCheck] = useState(false);
  const [schoolLoader, setSchoolLoader] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ criteriaMode: 'all' });

  useEffect(() => {
    setLoader(true);
    callAPI('get', 'https://trfdx152e8.execute-api.us-east-1.amazonaws.com/testing/allschoolinfo')
      .then((res) => {
        console.log(res);
        setSchoolData(res);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // callAPI('get', 'https://rglyy43j7a.execute-api.us-east-1.amazonaws.com/testing/curriculum_data')
    //   .then((res) => {
    //     console.log(res);
    //     setCurriculumData(res);
    //     setLoader(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  useEffect(() => {
    setTeacherStu({});
    const fetchApiData = async (str) => {
      const response = await fetch(
        `https://w93la61wz4.execute-api.us-east-1.amazonaws.com/testing/all_teacher_student?schoolname=${str}`
      );
      const data = await response.json();
      return data;
    };

    // Function to call the API for each string and store the results
    const fetchAllData = async () => {
      setSchoolLoader(true);
      // Derive stringsArray from name prop
      const stringsArray = schoolName?.map((item) => item.value) || [];

      // Perform API calls and aggregate results
      const promises = stringsArray.map(async (str) => {
        const data = await fetchApiData(str);
        return {
          teacher: data.teacher,
          student: data.student
        };
      });

      // Wait for all the promises to resolve
      const resultsArray = await Promise.all(promises);

      // Aggregate results into separate arrays for teachers and students
      const aggregatedResults = resultsArray.reduce(
        (acc, result) => {
          acc.teacher = acc.teacher.concat(result.teacher);
          acc.student = acc.student.concat(result.student);
          return acc;
        },
        { teacher: [], student: [] }
      );

      console.log('aggregatedResults', aggregatedResults);
      // Update the state with the aggregated results
      setTeacherStu(aggregatedResults);
      setSchoolLoader(false);
    };

    fetchAllData();
    // const schoolN = schoolName?.map((item) => item.value);
    // setTeacherStu({
    //   teacher: teacherDataInSchool,
    //   student: studentDataInSchool
    // });
    // schoolN?.map((school) => {
    //   setSchoolLoader(true);
    //   callAPI(
    //     'get',
    //     `https://w93la61wz4.execute-api.us-east-1.amazonaws.com/testing/all_teacher_student?schoolname=${school}`
    //   )
    //     .then((res) => {
    //       console.log(res);
    //       setTeacherStu({
    //         teacher: [...teacherStu.teacher, ...res.teacher],
    //         student: [...teacherStu.student, ...res.student]
    //       });
    //       return {
    //         teacher: [...teacherStu.teacher, ...res.teacher],
    //         student: [...teacherStu.student, ...res.student]
    //       };
    //       setSchoolLoader(false);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // });
  }, [schoolName]);

  const onSubmit = (data) => {
    if (schoolName.length === 0) setSchoolError(true);
    setLoader(true);
    callAPI(
      'get',
      `https://7nluheb3kb.execute-api.us-east-1.amazonaws.com/testing/check_availability?cohortName=${data.cohortName}`
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          setNameCheck(true);
        } else {
          setNameCheck(false);
          callAPI(
            'post',
            'https://nzfhtxfyg8.execute-api.us-east-1.amazonaws.com/testing/cohor_insert',
            {
              schoolName: schoolName.map((item) => item.value).join(', '),
              // moderator: '', //data.moderator.map((item) => item.value).join(', '),
              cohortName: data.cohortName,
              students: data.students.map((item) => item.value).join(', '),
              teachers: data.teacher.map((item) => item.value).join(', '),
              noOfSessions: data.noOfSessions,
              moderator: '',
              moderatorUid: '',
              time: convertTo24Hour(selectValue.time).trim(),
              day: selectValue.day,
              timeZone: selectValue.timeZone
            }
          )
            .then((res) => {
              console.log(res);
              navigate('/cohorts');
              setLoader(false);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onError = (data) => {
    console.log('calling', data);
    setSelectError(true);
    setMultiSelectError({ ...data });
    if (schoolName.length === 0) setSchoolError(true);
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
            name: 'Cohorts',
            link: '/cohorts'
          }
        }}
        lastValue={'Create Cohort'}
      />
      <div className="accounts-header">
        <h1> Create Cohort</h1>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="create-cohort-form-container">
            <div className="cohort-form-row-1">
              <div className="cohort-form-left">
                <h4>Cohort definiton</h4>
              </div>
              <div className="cohort-form-right">
                <p>Cohort name</p>
                {/* <input type='text' className="cohort-input"/> */}
                <div className="add-cohort-input-box">
                  <InputField
                    label={''}
                    value={'cohortName'}
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
                {/* <div className="openCohort">
                  <p>Open Cohort</p>
                  <input {...register('openCohort')} type="checkbox" name={'openCohort'} id="" />
                </div> */}
                <p>School name</p>
                {/* <input type='text' className="cohort-input"/> */}
                <div className="add-cohort-input-box">
                  <MultipleSelect
                    control={control}
                    name={'schoolName'}
                    options={schoolData.map((item) => {
                      return {
                        label: item.schoolname,
                        value: item.schoolname
                      };
                    })}
                    setSchool={(data) => setSchoolName(data)}
                    checker={true}
                  />
                  {schoolError && schoolName.length === 0 ? (
                    <p className="add-school-error">{`⚠ This input is required.`}</p>
                  ) : (
                    <></>
                  )}
                  {/* {checked ? (
                    <>
                      <MultipleSelect
                        control={control}
                        name={'schoolName'}
                        options={schoolData.map((item) => {
                          return {
                            label: item.schoolname,
                            value: item.schoolname
                          };
                        })}
                        setSchool={(data) => setSchoolName(data)}
                        checker={true}
                      />
                      {schoolError && schoolName.length === 0 ? (
                        <p className="add-school-error">{`⚠ This input is required.`}</p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div className="select-cohort">
                      <SelectInputField
                        options={schoolData.map((item) => item.schoolname)}
                        selectData={
                          (dataValue) => setSchoolName([{ value: dataValue }])
                          // setSelectValue({ ...selectValue, schoolName: dataValue })
                        }
                        select={schoolName[0]?.value}
                        selectError={selectError}
                      />
                    </div>
                  )} */}
                </div>

                <div className="dateTime">
                  <div className="date">
                    <p>Select Day</p>
                    <div className="date-select">
                      <SelectInputField
                        options={Constants.DAY}
                        selectData={(dataValue) =>
                          setSelectValue({ ...selectValue, day: dataValue })
                        }
                        select={selectValue.day}
                        selectError={selectError}
                      />
                    </div>
                  </div>
                  <div className="date">
                    <p>Select Time</p>
                    <div className="date-select">
                      <SelectInputField
                        options={Constants.TIME}
                        selectData={(dataValue) =>
                          setSelectValue({ ...selectValue, time: dataValue })
                        }
                        select={selectValue.time}
                        selectError={selectError}
                      />
                    </div>
                  </div>
                  <div className="date-timezone">
                    <p>Select Timezone</p>
                    <div className="date-select">
                      <SelectInputField
                        options={Constants.TIMEZONE}
                        selectData={(dataValue) =>
                          setSelectValue({ ...selectValue, timeZone: dataValue })
                        }
                        select={selectValue.timeZone}
                        selectError={selectError}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p>Add no. of sessions</p>
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
            </div>
            <hr />
            {/* <div className="cohort-form-row-2">
              <div className="cohort-form-left">
                <h4>Adding moderators to Cohort</h4>
              </div>
              <div className="cohort-form-right">
                <p>Search and add moderator</p>
                <MultipleSelect
                  control={control}
                  name={'moderator'}
                  options={[
                    { label: 'Chocolate', value: 'chocolate' },
                    { label: 'Strawberry', value: 'strawberry' },
                    { label: 'Coconut', value: 'coconut' },
                    { label: 'Vanilla', value: 'vanilla' },
                    { label: 'Blueberry', value: 'blueberry' },
                    { label: 'Red Velvet', value: 'velvet' }
                  ]}
                />
                {'moderator' in multiSelectError ? (
                  <p className="add-school-error">{`⚠ This input is required.`}</p>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <hr /> */}
            {schoolLoader ? (
              <Loader />
            ) : (
              <>
                <div className="cohort-form-row-2">
                  <div className="cohort-form-left">
                    <h4>Adding teachers to Cohort</h4>
                  </div>
                  <div className="cohort-form-right">
                    <p>Search and add teacher</p>
                    <MultipleSelect
                      control={control}
                      name={'teacher'}
                      options={teacherStu.teacher.map((item) => {
                        return {
                          label: item.firstName + ' (' + item.emailId + ')',
                          value: item.firstName + ' (' + item.emailId + ')'
                        };
                      })}
                    />
                    {'teacher' in multiSelectError ? (
                      <p className="add-school-error">{`⚠ This input is required.`}</p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <hr />
                <div className="cohort-form-row-3">
                  <div className="cohort-form-left">
                    <h4>Adding students to Cohort</h4>
                  </div>
                  <div className="cohort-form-right">
                    <p>Search and add students</p>
                    <MultipleSelect
                      control={control}
                      name={'students'}
                      options={teacherStu.student.map((item) => {
                        return {
                          label: item.firstName + ' (' + item.userName + ')',
                          value: item.firstName + ' (' + item.userName + ')'
                        };
                      })}
                    />
                    {'students' in multiSelectError ? (
                      <p className="add-school-error">{`⚠ This input is required.`}</p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <hr />
              </>
            )}

            {/* <div className="cohort-form-row-4">
              <div className="cohort-form-left">
                <h4>Add curriculum</h4>
              </div>
              <div className="cohort-form-right">
                <p>Select curriculum preset</p>
                <div className="select-cohort">
                  <SelectInputField
                    options={curriculumData.map((item) => item.nameOfPreset)}
                    selectData={(dataValue) =>
                      setSelectValue({ ...selectValue, nameOfPreset: dataValue })
                    }
                    select={selectValue.nameOfPreset}
                    selectError={selectError}
                  />
                </div>
                <MultipleSelect
                  control={control}
                  name={'curriculums'}
                  options={curriculumData.map((item) => {
                    return {
                      label: item.nameOfPreset,
                      value: item.nameOfPreset
                    };
                  })}
                />
                {'curriculums' in multiSelectError ? (
                  <p className="add-school-error">{`⚠ This input is required.`}</p>
                ) : (
                  <></>
                )}
              </div>
            </div> */}
          </div>
          <div className="create-cohort-submit">
            <button className="create-cohort-submit-btn">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateCohort;
