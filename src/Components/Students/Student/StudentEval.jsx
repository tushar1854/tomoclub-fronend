import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import Loader from '../../Common/Loader/Loader';
import TableCombined from '../../Sessions/CommonSession/TableCombined';
import TextBox from '../../Common/TextBox/TextBox';
import { useLocation, useParams } from 'react-router-dom';
import { callAPI } from '../../../Helper';

const StudentEval = () => {
  const [loader, setLoader] = useState(false);
  const [isEditEval, setIsEditEval] = useState(true);
  const [sessionEval, setSessionEval] = useState({
    leadership: {
      'Initiative Taking and Tenacity': -1,
      'Effective Communication': -1,
      'Team Player': -1,
      'Team Building': -1,
      'Strategic Thinking': -1
    },
    emotionalIntelligence: {
      Empathy: -1,
      Resilience: -1,
      'Social Awareness': -1,
      'Emotional Self Awareness': -1,
      'Emotional Regulation': -1
    },
    innovation: {
      'Creative Thinking': -1,
      Flexibility: -1,
      Curiosity: -1,
      'Critical Thinking': -1,
      'Risk Taking': -1
    },
    remark: ''
  });

  let params = useParams();
  let location = useLocation();
  const singleStudentEval = `${location.state.firstName} (${params.student})`;

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://ndco3rth29.execute-api.us-east-1.amazonaws.com/testing/evaluation-read?sessionid=${location.state.sessionUid}`
    )
      .then((res) => {
        console.log(singleStudentEval);
        console.log(res.student[singleStudentEval]);
        if (res.student[singleStudentEval]) {
          setIsEditEval(false);
          setSessionEval(res.student[singleStudentEval]);
        } else {
          setIsEditEval(true);
          setSessionEval({
            leadership: {
              'Initiative Taking and Tenacity': -1,
              'Effective Communication': -1,
              'Team Player': -1,
              'Team Building': -1,
              'Strategic Thinking': -1
            },
            emotionalIntelligence: {
              Empathy: -1,
              Resilience: -1,
              'Social Awareness': -1,
              'Emotional Self Awareness': -1,
              'Emotional Regulation': -1
            },
            innovation: {
              'Creative Thinking': -1,
              Flexibility: -1,
              Curiosity: -1,
              'Critical Thinking': -1,
              'Risk Taking': -1
            },
            remark: ''
          });
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  const handleSessionEval = () => {
    if (isEditEval) {
      console.log('sessionEval', {
        ...sessionEval,
        student: singleStudentEval,
        sessionId: location.state.sessionUid
      });
      setLoader(true);
      callAPI('post', 'https://jksq4380td.execute-api.us-east-1.amazonaws.com/testing/evaluation', {
        ...sessionEval,
        studentUsername: singleStudentEval,
        sessionId: location.state.sessionUid
      })
        .then((res) => {
          console.log(res);
          setLoader(false);
          setIsEditEval(!isEditEval);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsEditEval(!isEditEval);
    }
  };

  return (
    <div className="cohorts-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Students',
            link: '/students'
          },
          3: {
            name: 'Session',
            link: '/session'
          }
        }}
        lastValue={params.student}
      />
      <div className="accounts-header">
        <h1>{`${location.state.firstName} ${location.state.lastName}`}</h1>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="session-head-desc">
            <div className="desc-column">
              <div className="left-desc">
                <p className="first-p">Cohort name:</p> <p>{location.state.cohortName}</p>
                {/* <p>{location.state?.session?.cohortUid}</p> */}
              </div>
              <div className="right-desc">
                <p className="first-p">Session Status:</p> <p>{location.state.status}</p>
                {/* <p>{location.state?.session?.cohortUid}</p> */}
              </div>
            </div>
            <div className="desc-column">
              <div className="left-desc">
                <p className="first-p">Session ID:</p> <p>{location.state.sessionUid}</p>
                {/* <p>{location.state?.session?.sessionId}</p> */}
              </div>
              <div className="right-desc">
                <p className="first-p">Session Date:</p> <p>{location.state.sessionDate}</p>
                {/* <p>{location.state?.session?.sessionId}</p> */}
              </div>
            </div>
          </div>
          <div className="ribbon">
            <div className="ribbon-item ribbon-item-1">
              <h4>Session Evaluation</h4>
            </div>
          </div>
          <div className="create-cohort-form-container-sess">
            <>
              <button
                className="hanna-eval-btn-1"
                onClick={() =>
                  window.open(
                    `https://pzjhm1zapg.execute-api.us-east-1.amazonaws.com/testing/evaluation-download?sessionid=${location.state.sessionUid}`,
                    '_blank'
                  )
                }>
                Download Report
              </button>
              <TableCombined
                title={'Leadership'}
                value={'leadership'}
                question1={'Initiative Taking and Tenacity'}
                question2={'Effective Communication'}
                question3={'Team Player'}
                question4={'Team Building'}
                question5={'Strategic Thinking'}
                evalT={sessionEval}
                setEval={setSessionEval}
                isEditEval={isEditEval}
              />
              <TableCombined
                title={'Emotional Intelligence'}
                value={'emotionalIntelligence'}
                question1={'Empathy'}
                question2={'Resilience'}
                question3={'Social Awareness'}
                question4={'Emotional Self Awareness'}
                question5={'Emotional Regulation'}
                evalT={sessionEval}
                setEval={setSessionEval}
                isEditEval={isEditEval}
              />
              <TableCombined
                title={'Innovation'}
                value={'innovation'}
                question1={'Creative Thinking'}
                question2={'Flexibility'}
                question3={'Curiosity'}
                question4={'Critical Thinking'}
                question5={'Risk Taking'}
                evalT={sessionEval}
                setEval={setSessionEval}
                isEditEval={isEditEval}
              />
              <TextBox
                label={'Remark'}
                value={sessionEval.remark}
                onChange={(data) => setSessionEval({ ...sessionEval, remark: data })}
                disabled={!isEditEval}
              />
              <button className="hanna-eval-btn" onClick={handleSessionEval}>
                {isEditEval ? 'Save' : 'Edit'}
              </button>
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentEval;
