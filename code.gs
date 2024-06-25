function updatePrayerTime() {
  const calenderId = 'YOUR_CALENDAR_ID';
  const city = 'Kerala'; // your city
  const country = 'India'; // your country
  const method = 1;  //check http://api.aladhan.com/v1/methods for various methods I here used University of Islamic Sciences, Karachi
  const url = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  console.log("data = ",data);
  const timings = data.data.timings;
  const calendar = CalendarApp.getCalendarById(calenderId);

  function addOrUpdateEvent(summary,timeStr) {
    const date = new Date();
    const [hours,minutes] = timeStr.split(':').map(Number);
    let startTime;
    // 50 min before sunrise for fajr 
    if(summary == 'Fajr prayer') {
      const sunriseTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
      startTime = new Date(sunriseTime.getTime() - 50 * 60000);
    } else if (summary == 'Maghrib prayer'){
        //maghrib on time , if you need to set prayer time on time , use the below code , rm if else 
      startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
    } else {
        //other prayers after 10 mins
      startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
      startTime = new Date(startTime.getTime()+ 10 * 60000);
    }
    const endTime = new Date(startTime.getTime()+ 20 * 60000) // 20 * 60 seconds * 1000 milliseconds
    console.log(summary,hours,minutes);


    // Delete existing events with the same summary for the current day
    const events = calendar.getEventsForDay(startTime, { search: summary });
    events.forEach(event => event.deleteEvent());

    // Create a new recurring event
    const recurrence = CalendarApp.newRecurrence().addDailyRule();
    calendar.createEventSeries(summary, startTime, endTime, recurrence);

  }
  addOrUpdateEvent('Fajr prayer',timings.Sunrise);
  addOrUpdateEvent('Dhuhr prayer', timings.Dhuhr);
  addOrUpdateEvent('Asr prayer', timings.Asr);
  addOrUpdateEvent('Maghrib prayer', timings.Maghrib);
  addOrUpdateEvent('Isha prayer', timings.Isha);
}

//use google script Triggers and triggr updatePrayerTime daily 

`
