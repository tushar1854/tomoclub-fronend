import React, { useEffect, useState } from 'react';

const DayOfWeekDateInput = ({ targetDay, setData }) => {
  useEffect(() => {
    setData(selectedDate.toISOString().split('T')[0]);
  }, []);

  const capitalizeFirstLetter = (inputString) => {
    if (!inputString || typeof inputString !== 'string') {
      return inputString;
    }

    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  };

  const getNextDayOfWeek = (date, dayName) => {
    if (!dayName) {
      console.error('Empty day name provided');
      return date;
    }
    const formattedDay = capitalizeFirstLetter(dayName);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetIndex = days.indexOf(formattedDay);

    if (targetIndex === -1) {
      console.error('Invalid day name provided');
      return date;
    }

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + ((targetIndex - date.getDay() + 7) % 7));
    return nextDate;
  };

  const [selectedDate, setSelectedDate] = useState(() => getNextDayOfWeek(new Date(), targetDay));

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(getNextDayOfWeek(selectedDate, targetDay));
    const dateObject = new Date(getNextDayOfWeek(selectedDate, targetDay));
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
    const day = String(dateObject.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setData(formattedDate);
  };

  // Get today's date in the format required by the input's min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <input
        type="date"
        id="dayOfWeekDate"
        value={selectedDate.toISOString().split('T')[0]} // Format date for input
        onChange={handleDateChange}
        min={today} // Set the minimum selectable date to today
      />
    </div>
  );
};

export default DayOfWeekDateInput;
