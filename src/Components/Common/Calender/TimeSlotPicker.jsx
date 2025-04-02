import React from 'react';

const TimeSlotPicker = ({ day, selectedSlots, onTimeSlotChange }) => {
  // Function to handle changes in time slots
  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...selectedSlots];
    updatedSlots[index][field] = value;
    onTimeSlotChange(day, updatedSlots);
  };

  // Function to add a new time slot
  const handleAddSlot = () => {
    const updatedSlots = [...selectedSlots, { start: '', end: '' }];
    onTimeSlotChange(day, updatedSlots);
  };

  // Function to remove a time slot
  const handleRemoveSlot = (index) => {
    const updatedSlots = selectedSlots.filter((_, i) => i !== index);
    onTimeSlotChange(day, updatedSlots);
  };

  return (
    <div>
      {selectedSlots.map((slot, index) => (
        <div key={index} className="mod-flex">
          {/* <label>Start Time:</label> */}
          <input
            type="time"
            value={slot.start}
            onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
          />
          <p className="unaval">to</p>
          {/* <label>End Time:</label> */}
          <input
            type="time"
            value={slot.end}
            onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
          />
          <div className="btn-del">
            {index >= 0 && (
              <button
                type="button"
                className="btn-mod unaval"
                onClick={() => handleRemoveSlot(index)}>
                -
              </button>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn-mod unaval" onClick={handleAddSlot}>
        +
      </button>
    </div>
  );
};

export default TimeSlotPicker;
