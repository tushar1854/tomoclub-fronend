export function mergeArrays(array1, array2) {
  const uuidMap = new Map();

  // Create a Map with UUIDs from array2 as keys and their corresponding JSON objects as values
  for (const json of array2) {
    uuidMap.set(json.uuid, json);
  }

  // Iterate through array1 and replace JSON objects with the same UUID if found in the Map
  const mergedArray = array1.map((json) => {
    const updatedJSON = uuidMap.get(json.uuid);
    return updatedJSON ? updatedJSON : json;
  });

  return mergedArray;
}

export function removeDuplicateObjects(array, propertyNames) {
  const seen = new Set();

  return array.filter((obj) => {
    const key = propertyNames.map((prop) => obj[prop]).join('_');

    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }

    return false;
  });
}

export const removeDuplicates = (arr, key) => {
  return Array.from(new Map(arr.map((item) => [item[key], item])).values());
};

export const capitalizeFirstChar = (str) => `${str?.charAt(0).toUpperCase()}${str?.slice(1)}`;

export const dateFormatter = (inputDate) => {
  const parts = inputDate.split('-');
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
};

export function removeBeforeTime(times, time) {
  if (!time) {
    return times;
  }

  const index = times.indexOf(time);
  if (index !== -1) {
    return times.slice(index + 1);
  }
  return times;
}

export function convertTo24Hour(time) {
  if (!time) return '';

  // Handle different formats and trim whitespace
  const timeString = time.trim().toUpperCase();
  const amPmMatch = timeString.match(/(.*?)\s*(AM|PM)$/i);
  
  if (!amPmMatch) return time; // Return original if no AM/PM found
  
  const timePart = amPmMatch[1];
  const modifier = amPmMatch[2];
  
  let [hours, minutes] = timePart.split(':');
  
  // Ensure hours and minutes are valid numbers
  hours = parseInt(hours, 10);
  minutes = minutes ? parseInt(minutes, 10) : 0;
  
  if (isNaN(hours) || isNaN(minutes)) return time;
  
  // Convert to 24-hour format
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Ensure hours and minutes are in valid ranges
  hours = Math.min(23, Math.max(0, hours));
  minutes = Math.min(59, Math.max(0, minutes));
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
