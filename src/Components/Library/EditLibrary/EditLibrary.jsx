import React, { useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import InputField from '../../Common/InputField/InputField';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const EditLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    formState: { errors },
    handleSubmit,
    reset,
    register
  } = useForm({ criteriaMode: 'all' });
  const [loader, setLoader] = useState(false);

  const onSubmit = (data) => {
    setLoader(true);
    const sessionData = {
      uid: location.state.uid,
      ...data
    };
    console.log('sessionData', sessionData);
    callAPI(
      'post',
      'https://8uyrm0llfk.execute-api.us-east-1.amazonaws.com/testing/game_read',
      sessionData
    )
      .then((res) => {
        console.log(res);
        navigate('/library');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
    reset();
  };

  const onError = (error) => {
    console.log(error);
  };

  const deleteGame = () => {
    setLoader(true);
    callAPI('post', 'https://jh92sh2dt4.execute-api.us-east-1.amazonaws.com/testing/game-delete', {
      gameName: location.state.gameName,
      delete: true
    })
      .then((res) => {
        console.log(res);
        navigate('/library');
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="library1-container">
      <BreadcrumbsLink
        breadcrumbValues={{
          1: {
            name: 'Home',
            link: '/home'
          },
          2: {
            name: 'Library',
            link: '/library'
          }
        }}
        lastValue={'Edit'}
      />
      <div className="accounts-header">
        <h1>Edit Game</h1>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="add-game-container">
            {/* <hr className="hr-library" /> */}
            <div className="add-game-open">
              <div className="library-left">
                <p>Game details</p>
              </div>
              <div className="library-right">
                <div className="library-right-row">
                  <div className="library-column">
                    <InputField
                      label={'Game name'}
                      value={'gameName'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.gameName}
                    />
                  </div>
                  <div className="library-column">
                    <InputField
                      label={'Game mode'}
                      value={'gameMode'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.gameMode}
                    />
                  </div>
                </div>
                <div className="library-right-row">
                  <div className="library-column">
                    <InputField
                      label={'Game theme'}
                      value={'theme'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.theme}
                    />
                  </div>
                  <div className="library-column">
                    <InputField
                      label={'Skills in focus'}
                      value={'skill'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.skill}
                    />
                  </div>
                </div>
                <div className="library-right-row">
                  <div className="library-column">
                    <InputField
                      label={'Casel Competencies'}
                      value={'csCompetency'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.csCompetency}
                    />
                  </div>
                  <div className="library-column">
                    <InputField
                      label={'TomoClub Competencies'}
                      value={'tcCompetency'}
                      register={register}
                      errors={errors}
                      option={{
                        required: 'This input is required.'
                      }}
                      defaultValueT={location.state.tcCompetency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="btn-game">Update game</button>
          <button className="btn-game" onClick={deleteGame}>
            Delete Game
          </button>
        </form>
      )}
    </div>
  );
};

export default EditLibrary;
