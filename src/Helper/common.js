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
  let [hours, minutes] = time.slice(0, -2).split(':');
  const period = time.slice(-2);

  if (period === 'PM' && hours !== '12') {
    hours = String(+hours + 12);
  } else if (hours === '12' && period === 'AM') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}
