// src/utils/calendarHelpers.js

export const downloadIcsFile = (booking) => {
  const { roomName, date, timeSlot, details } = booking;
  const [startTimeStr, endTimeStr] = timeSlot.split(' - ');

  const [year, month, day] = date.split('-');
  const [startH, startM] = startTimeStr.trim().split(':');
  const [endH, endM] = endTimeStr.trim().split(':');

  const dtStart = `${year}${month}${day}T${startH.padStart(2, '0')}${startM.padStart(2, '0')}00`;
  const dtEnd = `${year}${month}${day}T${endH.padStart(2, '0')}${endM.padStart(2, '0')}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Silah Room Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Silah Booking: ${roomName}`,
    `LOCATION:${roomName}`,
    `DESCRIPTION:${details || 'Room reservation booked via Silah.'}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Silah-Booking-${date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getOutlookWebUrl = (booking) => {
  const { roomName, date, timeSlot, details } = booking;
  const [startTimeStr, endTimeStr] = timeSlot.split(' - ');

  const startIso = `${date}T${startTimeStr.trim()}:00`;
  const endIso = `${date}T${endTimeStr.trim()}:00`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: `Silah Booking: ${roomName}`,
    startdt: startIso,
    enddt: endIso,
    body: details || 'Room reservation booked via Silah.',
    location: roomName,
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
};