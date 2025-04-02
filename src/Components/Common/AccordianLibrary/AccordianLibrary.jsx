import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField/InputField';

const AccordianLibrary = ({ name, setData }) => {
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm({ criteriaMode: 'all' });
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(true);
  const onSubmit = (data) => {
    let sessionData = {};
    sessionData[name.replace(/ /g, '_')] = data;
    setData(sessionData);
    setSaved(true);
  };

  const onError = (error) => {
    console.log(error);
  };
  return (
    <>
      {show ? (
        <div className="add-game-closed" onClick={() => setShow(false)}>
          <p>+ {name}</p>
        </div>
      ) : (
        <form className="add-game-open" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="library-left" onClick={() => setShow(true)}>
            <p>- {name}</p>
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
                />
              </div>
            </div>
            <div className="library-right-row">
              <div className="library-column">
                <button className="save-game">Save Game</button>
                {saved && <p className="saved-session-tag">Saved !</p>}
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AccordianLibrary;
