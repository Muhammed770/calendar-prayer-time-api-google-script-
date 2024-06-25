# Calendar Prayer Time Update - Google Script

This Google Apps Script automates the update of prayer times in your Google Calendar using data fetched from the Aladhan API. The script utilizes the University of Islamic Sciences, Karachi method for calculating prayer times.

## Getting Started

### Prerequisites

To use this script, you'll need:

- **Google Account**: To access Google Calendar and Google Apps Script.
- **Calendar ID**: Obtain your Google Calendar ID where you want to add the prayer times.
- **City and Country**: Update the `city` and `country` variables in the script to match your location.

### Setup Instructions

1. **Google Calendar Setup**:
   - Create a new Google Calendar if you haven't already.
   - Note down the Calendar ID (`calenderId` in the script) which can be found in Calendar settings.

2. **Google Apps Script Setup**:
   - Open Google Apps Script ([script.google.com](https://script.google.com)).
   - Create a new script file and paste the provided `updatePrayerTime` function into it.

3. **Configure Trigger**:
   - Set up a trigger to execute the `updatePrayerTime` function daily.
     - In the Google Apps Script editor, go to **Triggers** (clock icon) > **Add Trigger**.
     - Choose `updatePrayerTime` as the function to run.
     - Set event source to Time-driven, and select day timer with specific time.

4. **Aladhan API Method**:
   - The script fetches prayer times from the Aladhan API using the University of Islamic Sciences, Karachi method. You can explore other methods by visiting [Aladhan API Methods](http://api.aladhan.com/v1/methods).

### Function Explanation

The `updatePrayerTime` function does the following:

- Fetches current prayer times using the Aladhan API based on your location.
- Calculates the start and end times for each prayer, adjusting them as needed.
- Deletes existing events for the same prayer on the current day to prevent duplicates.
- Creates a new recurring event series for each prayer time in your Google Calendar.

```javascript
function updatePrayerTime() {
  const calenderId = 'YOUR_CALENDAR_ID';
  const city = 'Kerala'; // Your city
  const country = 'India'; // Your country
  const method = 1;  // University of Islamic Sciences, Karachi
  
  const url = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  const timings = data.data.timings;
  const calendar = CalendarApp.getCalendarById(calenderId);

  function addOrUpdateEvent(summary, timeStr) {
    const date = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    let startTime;

    if (summary == 'Fajr prayer') {
      const sunriseTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
      startTime = new Date(sunriseTime.getTime() - 50 * 60000);
    } else if (summary == 'Maghrib prayer') {
      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    } else {
      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
      startTime = new Date(startTime.getTime() + 10 * 60000);
    }

    const endTime = new Date(startTime.getTime() + 20 * 60000);
    
    // Delete existing events with the same summary for the current day
    const events = calendar.getEventsForDay(startTime, { search: summary });
    events.forEach(event => event.deleteEvent());

    // Create a new recurring event series
    const recurrence = CalendarApp.newRecurrence().addDailyRule();
    calendar.createEventSeries(summary, startTime, endTime, recurrence);
  }

  // Add or update events for each prayer time
  addOrUpdateEvent('Fajr prayer', timings.Sunrise);
  addOrUpdateEvent('Dhuhr prayer', timings.Dhuhr);
  addOrUpdateEvent('Asr prayer', timings.Asr);
  addOrUpdateEvent('Maghrib prayer', timings.Maghrib);
  addOrUpdateEvent('Isha prayer', timings.Isha);
}


# calendarPrayerTimeUpdate-googleScript
This repository contains a Google Apps Script that updates prayer times in a Google Calendar based on data fetched from an external API. The script retrieves daily prayer timings for a specified location using the Aladhan API.

###License

This project is licensed under the MIT License
