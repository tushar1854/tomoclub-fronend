import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../../Config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import Saly from '../../assets/Saly.png';
import { ReactComponent as Tomoclub } from '../../assets/Tomoclub.svg';
import './login.css';
import { callAPI, sessionStorage } from '../../Helper';
import { UserAuth } from '../../Context/AuthContext';
import Loader from '../Common/Loader/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { logOut } = UserAuth();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    async function logOutEffect() {
      await logOut();
    }
    logOutEffect();
    window.sessionStorage.clear();
    window.localStorage.clear();
  }, []);

  const signInWithGoogle = async () => {
    try {
      let user = {};
      signInWithPopup(auth, googleProvider)
        .then((res) => {
          setLoader(true);
          user = {
            providerId: res.providerId,
            displayName: res.user.displayName,
            emailId: res.user.email,
            phoneNumber: res.user.providerData[0].phoneNumber,
            photoURL: res.user.photoURL,
            emailVerified: res.user.emailVerified,
            lastLoginAt: res.user.metadata.lastLoginAt
          };
          return callAPI(
            'post',
            'https://29xe7c2o66.execute-api.us-east-1.amazonaws.com/testing/login',
            user
          );
        })
        .then(async (loginData) => {
          if (!loginData.registered) {
            setLoader(false);
            navigate('/registration/addschool');
          } else if (!loginData.approved) {
            setLoader(false);
            navigate('/sucessPage', {
              state: {
                title: 'We received your bussiness query',
                description:
                  'Your account is pending approved. Please contact TomoClub at support@tomoclub.org.'
              }
            });
          } else {
            sessionStorage('user', JSON.stringify({ ...user, ...loginData }));
            setLoader(false);
            if (loginData.entity === 'moderator') {
              navigate('/session');
            } else {
              navigate('/home');
            }
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.error(err);
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <div className="container">
      <div className="leftBox newclass">
        <div className="leftText">
          <div className="logo">
            <Tomoclub />
          </div>
          <h1 className="leftHead">
            Most Engaging SEL <br /> Curriculum Ever
          </h1>
        </div>
        <div className="img">
          <img src={Saly} alt="Saly" />
        </div>
      </div>
      <div className="rightBox">
        <div className="box">
          <h2 className="headright">Login to your School Dashboard</h2>
          <div id="goo" className="customGPlusSignIn customBtn" onClick={signInWithGoogle}>
            <span className="icon"></span>
            <span className="buttonText">Continue with Google</span>
          </div>
          {/* <div id="appl" className="customGPlusSignIn customBtn">
            <span className="icon"></span>
            <span className="buttonText">Continue with Apple</span>
          </div>
          <div id="micr" className="customGPlusSignIn customBtn">
            <span className="icon"></span>
            <span className="buttonText">Continue with Microsoft</span>
          </div> */}
          <h4 className="suppText">
            In case your facing troubles logging in write to{' '}
            <a href="mailto:support@tomoclub.com">support@tomoclub.com</a>
          </h4>
          <div className="butn">
            <button className="btn" onClick={() => navigate('/registration/addschool')}>
              Register a School
            </button>
            {/* <button className="btn">Register as a Moderator</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
