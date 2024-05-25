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
  isWithinInterval,
  parse,
  endOfMonth,
} from "date-fns";
import "./styles/calendar.css";
import { SeeTimeBlocksModal } from "./components/SeeTimeBlocksModal";
import { useExtendDate } from "./components/context/ExtendDateContext";

const CalendarAdmin = () => {
  const [fullScheduleList, setFullScheduleList] = useState([]);
  const { extendDate, setExtendDate } = useExtendDate();

  //CURRENT DATE TRACKER
  const [dateOfEvent, setDateOfEvent] = useState(
    format(new Date(), "MM/dd/yy")
  );
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // State for the current month
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get the start date of the current month
  const startDateOfMonth = startOfMonth(currentMonth);

  // Get the end date of the current month
  const endDateOfMonth = endOfMonth(currentMonth);

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
    setCurrentMonth(addDays(endDateOfMonth, 1));
  };

  const handleSeeSchedClick = (date) => {
    const formattedDate = format(date, "MM/dd/yy");
    setDateOfEvent(formattedDate);
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
  }, [updateTrigger]);

  return (
    <div className="calendar-main-container">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth}>&lt;</button>
          <h2>{format(startDateOfMonth, "MMMM yyyy")}</h2>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {allDaysInGrid.map((day, index) => {
            const formattedDate = format(day, "MM/dd/yy");
            const hasEvent =
              fullScheduleList &&
              fullScheduleList.some((schedule) => schedule === formattedDate);
            const isHighlighted = extendDate
              ? isWithinInterval(day, {
                  start: parse(dateOfEvent, "MM/dd/yy", new Date()),
                  end: parse(extendDate, "yyyy-MM-dd", new Date()),
                })
              : false;

            return (
              <div
                key={index}
                className={`calendar-day ${
                  !isSameMonth(day, currentMonth) ? "other-month" : ""
                } ${isHighlighted ? "highlighted" : ""}`}
                onClick={() => handleSeeSchedClick(day)}
              >
                <div className={`calendar-day-num `}>
                  <p
                    className={`calendar-num ${
                      isToday(day) ? "current-day" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </p>
                </div>
                {hasEvent && <div className="full-schedule-circle"></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="see-sched-main-container">
        <SeeTimeBlocksModal
          dateOfEvent={dateOfEvent}
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </div>
    </div>
  );
};

export default CalendarAdmin;
