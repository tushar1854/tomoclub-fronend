import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import HomeContent from '../../Common/HomeContent/HomeContent';
import { useParams } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const School = () => {
  let params = useParams();
  const [loader, setLoader] = useState(false);
  const [school, setSchool] = useState({});

  let title = params.school.split('_').join(' ');

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://fb7si6b8qh.execute-api.us-east-1.amazonaws.com/testing/dashboardcountdata?schoolname=${title}`
    )
      .then((schoolListAPI) => {
        setSchool(schoolListAPI);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="homeContent-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              },
              2: {
                name: 'Schools',
                link: '/schools'
              }
            }}
            lastValue={title}
          />
          <HomeContent
            title={title}
            addCard1={'Total Student'}
            addCard2={'Total Teacher'}
            addCard3={'Total School'}
            statsCard1={'123+'}
            statsCard2={'6.35'}
            statsCard3={'78%'}
            schoolData={school}
          />
        </div>
      )}
    </>
  );
};

export default School;
