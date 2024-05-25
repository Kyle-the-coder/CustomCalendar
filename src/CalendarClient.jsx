import React, { useEffect, useState } from "react";
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
import "./styles/calendarclient.css";
import { SeeTimeBlocksClient } from "./components/client/SeeTimeBlockClient";

const CalendarClient = () => {
  const [fullScheduleList, setFullScheduleList] = useState([]);

  //STATES FOR MODALS
  const [isModalActive, setIsModalActive] = useState(false);
  const [isAddScheduleModalActive, setIsAddScheduleModalActive] =
    useState(false);
  const [dateOfEvent, setDateOfEvent] = useState(
    format(new Date(), "MM/dd/yy")
  );
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // State for the current month
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const handleSeeSchedClick = (date) => {
    const formattedDate = format(date, "MM/dd/yy");
    setDateOfEvent(formattedDate);
    setIsModalActive(true);
    setUpdateTrigger(!updateTrigger);
  };

  useEffect(() => {
    const searchLocalStorage = () => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        keys.push(key);
        setFullScheduleList(keys);
      }
    };
    searchLocalStorage();
  }, [isAddScheduleModalActive, isModalActive, updateTrigger]);

  return (
    <div
      className="calendar-client-main-container"
      style={{ marginBottom: "10%" }}
    >
      <div className="calendar-client">
        <div className="calendar-client-header">
          <button onClick={goToPreviousMonth}>&lt;</button>
          <h2>{format(startDateOfMonth, "MMMM yyyy")}</h2>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className="calendar-client-grid">
          {[...previousMonthDays, ...allDaysOfMonth, ...nextMonthDays].map(
            (day) => {
              const formattedDate = format(day, "MM/dd/yy");
              const hasEvent =
                fullScheduleList &&
                fullScheduleList.some((schedule) => schedule === formattedDate);

              return (
                <div
                  key={day.toString()}
                  className={`calendar-client-day ${
                    !isSameMonth(day, startDateOfMonth) && "cc-other-month"
                  }  ${!hasEvent && "cc-no-event"}`}
                  onClick={() => handleSeeSchedClick(day)}
                >
                  <div className={`calendar-client-day-num `}>
                    <p
                      className={`calendar-client-num ${
                        isToday(day) && "cc-current-day"
                      }`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                  {hasEvent && <div className="cc-full-schedule-circle"></div>}
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="see-tbc-main-container">
        <SeeTimeBlocksClient
          dateOfEvent={dateOfEvent}
          setIsModalActive={setIsModalActive}
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </div>
    </div>
  );
};

export default CalendarClient;
