import React, { useEffect, useState } from 'react';
import BreadcrumbsLink from '../../Common/BreadcrumbsLink/BreadcrumbsLink';
import { useLocation } from 'react-router-dom';
import Loader from '../../Common/Loader/Loader';
import { callAPI } from '../../../Helper';

const ModeratorDetail = () => {
  const location = useLocation();

  const [loader, setLoader] = useState(false);
  const [moderator, setModerator] = useState({});
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  useEffect(() => {
    setLoader(true);
    console.log(location.state.modId);
    callAPI(
      'get',
      `https://r6jexlw9v3.execute-api.us-east-1.amazonaws.com/testing/particular-mod_read?moderatoruid=${location.state.modId}`
    )
      .then((modData) => {
        console.log(modData);
        setModerator(modData[0]);
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
        <div className="hanna-container">
          <BreadcrumbsLink
            breadcrumbValues={{
              1: {
                name: 'Home',
                link: '/home'
              },
              2: {
                name: 'Experts',
                link: '/moderators'
              }
            }}
            lastValue={moderator.moderatorName}
          />
          <div className="hanna-basic">
            <h1>{moderator.moderatorName}</h1>
            <p>Experts</p>
          </div>

          <div className="hanna-box">
            <div className="samson-left">
              <h2 className="h2-mod">Personal Details</h2>
              <hr />
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>First Name</h5>
                  <h6>{moderator.firstName}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Last Name</h5>
                  <h6>{moderator.lastName}</h6>
                </div>
              </div>
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>E-mail Id</h5>
                  <h6>{moderator.email}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>Phone Number</h5>
                  <h6>{moderator.phoneNumber}</h6>
                </div>
              </div>
              <div className="hanna-row">
                <div className="hanna-left-data">
                  <h5>Country</h5>
                  <h6>{moderator.country}</h6>
                </div>
                <div className="hanna-left-data">
                  <h5>State</h5>
                  <h6>{moderator.state}</h6>
                </div>
              </div>
            </div>
            <div className="samson-right">
              <h2>Availability Schedule</h2>
              <hr />
              <div className="samson-schedule">
                {daysOfWeek.map((day, index) => {
                  const dayData = moderator[day];
                  return (
                    <div key={index} className="sam-sc-row">
                      <div className="sam-sc-left">
                        <p className="sc-day">{day.toUpperCase().slice(0, 3)}</p>
                      </div>
                      <div className="sam-sc-right">
                        {dayData && dayData.available ? (
                          dayData.slots.map((slot, slotIndex) => (
                            <p key={slotIndex}>
                              {slot.start} to {slot.end}
                            </p>
                          ))
                        ) : (
                          <p className="unaval">Unavailable</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeratorDetail;
