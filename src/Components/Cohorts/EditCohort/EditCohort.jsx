import React, { useEffect, useState } from 'react';
import './editCohort.css';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';
import MultipleSelectCohort from '../../Common/MultipleSelectCohort/MultipleSelectCohort';
import InputField from '../../Common/InputField/InputField';
function EditCohort() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cohortData, setCohortData] = useState({});
  const [loader, setLoader] = useState(false);
  const [teacherStu, setTeacherStu] = useState({});
  const [teacher, setTeacher] = useState([]);
  const [student, setStudent] = useState([]);
  // const [curriculumData, setCurriculumData] = useState([]);
  // const [curriculum, setCurriculum] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({ criteriaMode: 'all' });

  useEffect(() => {
    setLoader(true);
    // callAPI('get', 'https://rglyy43j7a.execute-api.us-east-1.amazonaws.com/testing/curriculum_data')
    //   .then((res) => {
    //     console.log(res);
    //     setCurriculumData(res);
    //     // setLoader(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    callAPI(
      'get',
      `https://tzxon37yg4.execute-api.us-east-1.amazonaws.com/testing/cohort_specific_read?cohortUid=${location.state.cohortUid}`
    )
      .then((cohortData) => {
        console.log(cohortData);
        setCohortData({ ...cohortData });
        setTeacher(cohortData.teachers);
        setStudent(cohortData.students);
        setValue('noOfSessions', cohortData.noOfSessions);
        var teacherStudentData = {
          teacher: [],
          student: []
        };
        Promise.all(
          cohortData?.schoolName?.split(', ')?.map((school) => {
            return callAPI(
              'get',
              `https://w93la61wz4.execute-api.us-east-1.amazonaws.com/testing/all_teacher_student?schoolname=${school}`
            )
              .then((res) => {
                console.log(res);
                teacherStudentData.teacher.push(res.teacher);
                teacherStudentData.student.push(res.student);
              })
              .catch((error) => {
                console.log(error);
              });
          })
        )
          .then(() => {
            setTeacherStu({
              teacher: teacherStudentData.teacher?.flat(),
              student: teacherStudentData.student?.flat()
            });
            setLoader(false);
          })
          .catch((error) => {
            console.error('Error during mapping:', error);
            setLoader(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  const onSubmit = (data) => {
    if (teacher[0]?.value) {
      var teach = teacher.map((teach) => teach.value);
    }
    if (student[0]?.value) {
      var stud = student.map((stu) => stu.value);
    }
    // if (curriculum[0]?.value) {
    //   var curr = curriculum.map((cur) => cur.value);
    // }
    console.log(teach, stud);
    const lData = {
      entity: 'data',
      info: {
        // curriculum: curr === undefined ? curriculum : curr,
        teacher: teach === undefined ? teacher : teach,
        student: stud === undefined ? student : stud,
        moderator: ''
      }
    };
    setLoader(true);
    callAPI(
      'post',
      'https://5bzu2l4q31.execute-api.us-east-1.amazonaws.com/testing/cohort_update',
      {
        cohortUid: location.state.cohortUid,
        students: stud === undefined ? student.join(', ') : stud.join(', '),
        teachers: teach === undefined ? teacher.join(', ') : teach.join(', '),
        // nameOfPreset: curr === undefined ? curriculum.join(', ') : curr.join(', '),
        schoolName: cohortData?.schoolName,
        cohortName: cohortData?.cohortName,
        noOfSessions: data.noOfSessions,
        moderator: 'TestA',
        moderatorUid: 'a0fa6771-8777-4f89-822c-6c70cd8053ab'
      }
    )
      .then((res) => {
        console.log(res);
        navigate('/cohorts');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
    console.log('data', lData);
  };

  const onError = (error) => {
    console.log('calling', error);
  };

  return (
    <div className="create-curr4-container curr5">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Cohort',
            link: '/cohorts'
          }
        }}
        lastValue={'Edit Cohort'}
      />
      <div className="accounts-header">
        <h1> Edit Cohort</h1>
      </div>

      {/* //form */}
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="create-curr4-form-container">
            <div className="cohort-form-row-1">
              <div className="cohort-form-left">
                <h4>Cohort definiton</h4>
              </div>
              <div className="cohort-form-right">
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>Cohort Name:</p>
                  </div>
                  <p>{cohortData.cohortName}</p>
                </div>
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>Open Cohort:</p>
                  </div>
                  <p>{cohortData.open_cohort ? 'Yes' : 'No'}</p>
                </div>
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>School Name:</p>
                  </div>
                  <p>{cohortData.schoolName}</p>
                </div>
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>Day:</p>
                  </div>
                  <p>{cohortData.day}</p>
                </div>
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>Time:</p>
                  </div>
                  <p>{cohortData.time}</p>
                </div>
                <div className="edit-cohort-r1">
                  <div className="edit-cohort-p-bold">
                    <p>Timezone:</p>
                  </div>
                  <p>{cohortData.timeZone}</p>
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
              </div>
            </div>
            <hr /> */}
            <div className="cohort-form-row-2">
              <div className="cohort-form-left">
                <h4>Adding teachers to Cohort</h4>
              </div>
              <div className="cohort-form-right">
                <p>Search and add teacher</p>
                <MultipleSelectCohort
                  // control={control}
                  name={'teacher'}
                  options={teacherStu?.teacher?.map((item) => {
                    return {
                      label: item.firstName + ' (' + item.emailId + ')',
                      value: item.firstName + ' (' + item.emailId + ')'
                    };
                  })}
                  defaultValue={teacher.map((teacher) => {
                    return { label: teacher, value: teacher };
                  })}
                  setSetter={(data) => setTeacher(data)}
                />
              </div>
            </div>
            <hr />
            <div className="cohort-form-row-3">
              <div className="cohort-form-left">
                <h4>Adding students to Cohort</h4>
              </div>
              <div className="cohort-form-right">
                <p>Search and add students</p>
                <MultipleSelectCohort
                  // control={control}
                  name={'students'}
                  options={teacherStu?.student?.map((item) => {
                    return {
                      label: item.firstName + ' (' + item.userName + ')',
                      value: item.firstName + ' (' + item.userName + ')'
                    };
                  })}
                  defaultValue={student.map((student) => {
                    return { label: student, value: student };
                  })}
                  setSetter={(data) => setStudent(data)}
                />
              </div>
            </div>
            <hr />
            <div className="cohort-form-row-4">
              <div className="cohort-form-left">
                <h4>Add no. of sessions</h4>
              </div>
              <div className="cohort-form-right">
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
                </div>{' '}
              </div>
            </div>
          </div>

          <div className="create-curr4-submit">
            <button className="create-curr4-submit-btn">Update Cohort</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditCohort;
