function updatePrayerTime() {
  const calenderId = 'mail.muhammed2002@gmail.com';
  const city = 'Kerala';
  const country = 'India';
  const method = 1;
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
    if(summary == 'Fajr prayer') {
      const sunriseTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
      startTime = new Date(sunriseTime.getTime() - 50 * 60000);
    } else if (summary == 'Maghrib prayer'){
      startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
    } else {
      startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),hours,minutes);
      startTime = new Date(startTime.getTime()+ 10 * 60000);
    }
    const endTime = new Date(startTime.getTime()+ 20 * 60000) // 20 * 60 seconds * 1000 milliseconds
    console.log(summary,hours,minutes);


    // Check for existing events with the same summary
    const events = calendar.getEventsForDay(startTime, { search: summary });
    if (events.length > 0) {
      const event = events[0];
      if (event.isRecurringEvent()) {
        const series = event.getEventSeries();
        series.deleteEventSeries();
      } else {
        event.deleteEvent();
      }
    }

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



