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

  // Generate an array of dates for the entire grid (including previous and next month)
  const allDaysInGrid = [];
  let currentDay = startDateOfWeek;

  while (allDaysInGrid.length < 35) {
    allDaysInGrid.push(currentDay);
    currentDay = addDays(currentDay, 1);
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
          {allDaysInGrid.map((day, index) => {
            const formattedDate = format(day, "MM/dd/yy");
            const hasEvent =
              fullScheduleList &&
              fullScheduleList.some((schedule) => schedule === formattedDate);
            const isSelectedDate = formattedDate === dateOfEvent;

            return (
              <div
                key={index}
                className={`calendar-client-day ${
                  !isSameMonth(day, startDateOfMonth) && "cc-other-month"
                }  ${!hasEvent && "cc-no-event"} ${
                  isSelectedDate ? "cc-selected-date" : ""
                }`}
                onClick={() => handleSeeSchedClick(day)}
              >
                <div className={`calendar-client-day-num `}>
                  <p
                    className={`calendar-client-num ${
                      isToday(day) ? "cc-current-day" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </p>
                </div>
                {hasEvent && <div className="cc-full-schedule-circle"></div>}
              </div>
            );
          })}
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
