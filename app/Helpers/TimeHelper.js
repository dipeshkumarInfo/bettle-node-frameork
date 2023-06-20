const compareTime = (startTime, endTime) => {
  // Parse the start and end times into hours and minutes
const [startHour, startMinute] = startTime.split(':').map(Number);
let [endHour, endMinute] = endTime.split(':').map(Number);

// If end time is 00:00, set it to 24:00 instead
if (endHour === 0 && endMinute === 0) {
  endHour = 24;
}

// Calculate the total number of minutes since midnight for each time
const startTotalMinutes = startHour * 60 + startMinute;
const endTotalMinutes = endHour * 60 + endMinute;

// Compare the total minutes to check that end time is greater than start time
return endTotalMinutes > startTotalMinutes;
}

const addTime = (startTime, hoursToAdd, minutesToAdd) => {
  // Convert start time to hours and minutes
  const [startHour, startMinute] = startTime.split(':').map(Number);

  // Add hours and minutes to start time
  let hour = parseInt(startHour) + parseInt(hoursToAdd);
  let minute = parseInt(startMinute) + parseInt(minutesToAdd);

  // Adjust hour and minute if needed
  if (minute >= 60) {
    hour += Math.floor(minute / 60);
    minute %= 60;
  }
  if (hour >= 24) {
    hour -= 24;
  }

  // Format result as "hh:mm"
  const paddedHour = hour.toString().padStart(2, '0');
  const paddedMinute =  minute.toString().padStart(2, '0');

  return `${paddedHour}:${paddedMinute}`;
}

module.exports = {
  compareTime,
  addTime
}
