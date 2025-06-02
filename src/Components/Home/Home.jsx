import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { UserAuth } from '../../Context/AuthContext';
// import Navbar from '../Navbar/Navbar';
// import Header from '../Header/Header';
import HomeContent from '../Common/HomeContent/HomeContent';
import { callAPI, getSessionStorage } from '../../Helper';
import Loader from '../Common/Loader/Loader';

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [school, setSchool] = useState({});

  const displayName = JSON.parse(getSessionStorage('user'))?.displayName;

  useEffect(() => {
    setLoader(true);
    callAPI(
      'get',
      `https://fb7si6b8qh.execute-api.us-east-1.amazonaws.com/testing/dashboardcountdata`
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
  // const { user, logOut } = UserAuth();
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await logOut();
  //     navigate('/');
  //     console.log('You are logged out');
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };
  if(loader) {
    return (
      <div className="homeContent-container">
        <Loader />
      </div>
    );
  }
  return (
    <>
        <div className="homeContent-container">
          <HomeContent
            title={'Hello ' + displayName + ' !'}
            addCard1={'Weekly Session'}
            addCard2={'Total Students'}
            addCard3={'Total Cohorts'}
            statsCard1={'123+'}
            statsCard2={'6.35'}
            statsCard3={'78%'}
            schoolData={school}
          />
        </div>
      {/* <div>
        Home Page <p>User Email: {user && user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div> */}
    </>
  );
};

export default Home;
