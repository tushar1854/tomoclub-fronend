import React from 'react';
import './accordianCurriculum.css';
import AccordianSelect from '../Acordian-Select/AccordianSelect';
import { useForm } from 'react-hook-form';
const AccordianCurriculum = () => {
  const sesId = 1;
  const { control } = useForm({ criteriaMode: 'all' });
  return (
    <div className="accordian-curr-container">
      <div className="cc-accordian">
        <div className="cc-accordian-left left">
          <h4 className="cc-acc-left-head">- Preset {sesId} details </h4>
        </div>
        <div className="cc-accordian-right right">
          <div className="cc-accordian-right-row">
            <div className="cc-acc-flex">
              <div className="cc-accordian-flex">
                <p>No. of sessions</p>
                <AccordianSelect
                  control={control}
                  name={'teachers'}
                  options={[
                    { label: 'Experts A', value: 'Experts A' },
                    { label: 'Mod B', value: 'Mod B' }
                  ]}
                />
              </div>
              <div className="cc-accordian-flex">
                <p>Game mode</p>
                <AccordianSelect
                  control={control}
                  name={'teachers'}
                  options={[
                    { label: 'Teacher A', value: 'Teacher A' },
                    { label: 'Teacher B', value: 'Teacher C' }
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="cc-accordian-right-row">
            <p>Game name</p>
            <div className="cc-accordian-select">
              <AccordianSelect
                control={control}
                name={'teachers'}
                options={[
                  { label: 'Kabbadi', value: 'Kabbadi' },
                  { label: 'Kho kho', value: 'kho kho' },
                  { label: 'Ludo', value: 'Ludo' }
                ]}
              />
            </div>
          </div>
          <div className="cc-accordian-right-row">
            <p>Game objectives</p>
            <div className="cc-accordian-select">
              <AccordianSelect
                control={control}
                name={'teachers'}
                options={[
                  { label: 'Kabbadi', value: 'Kabbadi' },
                  { label: 'Kho kho', value: 'kho kho' },
                  { label: 'Ludo', value: 'Ludo' }
                ]}
              />
            </div>
          </div>

          <div className="cc-accordian-right-row">
            <button className="cc-accordian-btn">Save Preset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordianCurriculum;
