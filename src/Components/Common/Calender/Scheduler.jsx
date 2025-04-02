import React from 'react';
import TimeSlotPicker from './TimeSlotPicker';

const Scheduler = ({ availability, handleAvailabilityToggle, handleTimeSlotChange }) => {
  return (
    <div>
      <div className="mod-table">
        {Object.keys(availability).map((day, index) => (
          <div key={index} className="mod-row">
            <div className="mod-row1">
              <input
                type="checkbox"
                checked={availability[day].available}
                onChange={() => handleAvailabilityToggle(day)}
              />
            </div>
            <div className="mod-row3 unaval">
              <h4>{day}</h4>
            </div>
            <div className="mod-row2">
              {availability[day].available && (
                <TimeSlotPicker
                  day={day}
                  selectedSlots={availability[day].slots}
                  onTimeSlotChange={handleTimeSlotChange}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scheduler;
