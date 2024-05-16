import React, { useState } from "react";
import { AddScheduleModal } from "./components/AddScheduleModal";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  subDays,
  getDaysInMonth,
  isSameMonth,
  isToday,
} from "date-fns";
import "./styles/calendar.css";

const Calendar = () => {
  const [fullScheduleList, setFullScheduleList] = useState(null);

  //STATES FOR FORM
  const [startTime, setStartTime] = useState(null);
  const [eventName, setEventName] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [dateOfEvent, setDateOfEvent] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(null);

  const [isAddScheduleModalActive, setIsAddScheduleModalActive] =
    useState(false);
  // State for the current month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  // Get the start date of the current month
  const startDateOfMonth = startOfMonth(currentMonth);

  // Get the start date of the first week of the month
  const startDateOfWeek = startOfWeek(startDateOfMonth);

  // Calculate the number of days in the month
  const daysInMonth = getDaysInMonth(currentMonth);

  // Generate an array of dates for the entire month
  const allDaysOfMonth = [...Array(daysInMonth)].map((_, index) =>
    addDays(startDateOfWeek, index)
  );

  // Fill in days from the previous month
  const previousMonthDays = [];
  if (startDateOfWeek.getDate() !== 1) {
    const daysToAdd = startDateOfWeek.getDay() - 1;
    const previousMonthStart = subDays(startDateOfWeek, daysToAdd);
    for (let i = 0; i < daysToAdd; i++) {
      previousMonthDays.push(subDays(previousMonthStart, i));
    }
  }

  // Fill in days from the next month
  const nextMonthDays = [];
  const totalDaysDisplayed = allDaysOfMonth.length + previousMonthDays.length;
  const remainingDays = 35 - totalDaysDisplayed;
  const endDate = addDays(
    allDaysOfMonth[allDaysOfMonth.length - 1],
    remainingDays
  );
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push(addDays(endDate, i));
  }

  // Function to navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(subDays(startDateOfMonth, 1));
  };

  // Function to navigate to the next month
  const goToNextMonth = () => {
    setCurrentMonth(addDays(startDateOfMonth, 32)); // Add 32 days to avoid issues with month lengths
  };

  function activateScheduleModal() {
    setIsAddScheduleModalActive(true);
  }

  // Function to handle clicking on a date
  const handleDateClick = (date) => {
    const formattedDate = format(date, "MM/dd/yy");
    setDateOfEvent(formattedDate); // Set the selected date
    setIsAddScheduleModalActive(true); // Open the modal
  };

  return (
    <div className="calendar-main-container">
      {isAddScheduleModalActive ? (
        <AddScheduleModal
          dateOfEvent={dateOfEvent}
          setIsAddScheduleModalActive={setIsAddScheduleModalActive}
          setEndTime={setEndTime}
          setStartTime={setStartTime}
          setEventName={setEventName}
          startTime={startTime}
          endTime={endTime}
          eventName={eventName}
        />
      ) : (
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={goToPreviousMonth}>&lt;</button>
            <h2>{format(startDateOfMonth, "MMMM yyyy")}</h2>
            <button onClick={goToNextMonth}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {[...previousMonthDays, ...allDaysOfMonth, ...nextMonthDays].map(
              (day) => (
                <div
                  key={day.toString()}
                  className={`calendar-day ${
                    !isSameMonth(day, startDateOfMonth) && "other-month"
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={`calendar-day-num `}>
                    <p
                      className={`calendar-num ${
                        isToday(day) && "current-day"
                      }`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                  {fullScheduleList != null && (
                    <div className="full-schedule-circle"></div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
