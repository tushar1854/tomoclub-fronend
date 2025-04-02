import React from 'react';
import './accordian.css';

// import MultipleSelect from '../MultipleSelect/MultipleSelect';
import AccordianSelect from '../Acordian-Select/AccordianSelect';
import { useForm } from 'react-hook-form';
const Accordian = () => {
  const sesId = 1;
  const { control } = useForm({ criteriaMode: 'all' });
  return (
    <>
      <div className="accordian-page-container">
        <div className="accordian">
          <div className="accordian-left left">
            <h4 className="acc-left-head">- Session {sesId} details </h4>
          </div>
          <div className="accordian-right right">
            <div className="accordian-right-row">
              <p>Session date</p>
              <div className="accordian-select accordian-date-input">
                <input type="date" className="" name="" id="" />
              </div>
            </div>
            <div className="accordian-right-row">
              <p>Session time</p>
              <div className="accordian-select">
                <AccordianSelect
                  control={control}
                  name={'teachers'}
                  options={[
                    { label: 'Kabbadi', value: 'Kabbadi' },
                    { label: 'Kho kho', value: 'kho kho' },
                    { label: 'Ludo', value: 'Ludo' }
                  ]}
                />
                <p>to</p>
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
            <div className="accordian-right-row">
              <div className="acc-flex">
                <div className="accordian-flex">
                  <p>Experts Incharge</p>
                  <AccordianSelect
                    control={control}
                    name={'teachers'}
                    options={[
                      { label: 'Experts A', value: 'Experts A' },
                      { label: 'Mod B', value: 'Mod B' }
                    ]}
                  />
                </div>
                <div className="accordian-flex">
                  <p>Teacher Incharge</p>
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
            <div className="accordian-right-row">
              <p>Game Name</p>
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
            <div className="accordian-right-row">
              <button className="accordian-btn">Save session</button>
            </div>
          </div>
        </div>
      </div>
      <div className="accordian-closed">
        <div className="accordian-closed-container">
          <hr />
          <h4> + Session {sesId} details </h4>
        </div>
      </div>
    </>
  );
};

export default Accordian;
