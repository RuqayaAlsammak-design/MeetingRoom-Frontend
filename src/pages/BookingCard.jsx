import React from 'react';
import { downloadIcsFile, getOutlookWebUrl } from '../utils/calendarHelpers';

function BookingCard({ booking }) {
  return (
    <div className="booking-card">
      <h3>{booking.roomName}</h3>
      <p>📅 {booking.date} | ⏰ {booking.timeSlot}</p>

      {/* Button to download .ics file */}
      <button 
        type="button" 
        onClick={() => downloadIcsFile(booking)}
        className="btn-calendar"
      >
        📥 Download .ics File
      </button>

      {/* Direct link to Outlook Web */}
      <a 
        href={getOutlookWebUrl(booking)} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn-outlook"
      >
        📅 Add to Outlook Web
      </a>
    </div>
  );
}

export default BookingCard;