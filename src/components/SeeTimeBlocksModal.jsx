import "../styles/seeschedulemodal.css";
import close from "../assets/close.png";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { AddTimeBlockDisplay } from "./AddTimeBlockDisplay";

export function SeeTimeBlocksModal({
  setIsModalActive,
  setIsSeeScheduleModalActive,
  dateOfEvent,
}) {
  const [fullScheduleList, setFullScheduleList] = useState([]);
  const [dayScheduleList, setDayScheduleList] = useState([]);
  const [isSchedLoaded, setIsSchedLoaded] = useState(false);
  const [isAddScheduleModalActive, setIsAddScheduleModalActive] =
    useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  function closeModal() {
    setIsSeeScheduleModalActive(false);
    setIsModalActive(false);
  }

  function handleAddTimeBlockModal() {
    setIsAddScheduleModalActive(true);
  }

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
  }, [isAddScheduleModalActive]);

  useEffect(() => {
    fullScheduleList.forEach((date) => {
      console.log("ran", updateTrigger);
      if (date === dateOfEvent) {
        const eventList = localStorage.getItem(dateOfEvent);
        if (eventList) {
          try {
            const parsedList = JSON.parse(eventList);
            const events = parsedList.map((item) => JSON.parse(item));
            setDayScheduleList(events);
            setIsSchedLoaded(true);
          } catch (error) {
            console.error("Error parsing JSON data from localStorage", error);
          }
        } else {
          setDayScheduleList([]);
          setIsSchedLoaded(true);
        }
      }
    });
  }, [fullScheduleList, updateTrigger]);

  return (
    <div className="see-timeblock-main-container">
      <div className="timeblock-display-container">
        <div className="tb-display-top">
          <h1>Schedule for:</h1>
          <h1>{dateOfEvent}</h1>
          <img
            src={close}
            onClick={() => closeModal()}
            className="tb-close-button"
          />
        </div>
        <div className="tb-sched-container">
          {isSchedLoaded &&
            dayScheduleList.map((sched, index) => {
              const endTimeParsed = parse(sched.endTime, "HH:mm", new Date());
              const endTime = format(endTimeParsed, "hh:mm a");
              const startTimeParsed = parse(
                sched.startTime,
                "HH:mm",
                new Date()
              );
              const startTime = format(startTimeParsed, "hh:mm a");
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor:
                      hoveredIndex === index
                        ? sched.isAvailableAppt
                          ? "rgba(166, 245, 242, 0.479)"
                          : "darkRed"
                        : sched.isAvailableAppt
                        ? "lightGreen"
                        : "red",
                  }}
                  className="tb-container"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <h2 className="tb">
                    {startTime} - {endTime}
                  </h2>
                  {sched.isAvailableAppt ? (
                    <h2 className="tb-end">Available</h2>
                  ) : (
                    <h2 className="tb-end">Unavailable</h2>
                  )}
                </div>
              );
            })}
        </div>
        <div className="add-schedule-button-container">
          <button
            className="tb-submit-button"
            onClick={() => handleAddTimeBlockModal()}
          >
            Add Time Block
          </button>
        </div>
        {isAddScheduleModalActive && (
          <AddTimeBlockDisplay
            dateOfEvent={dateOfEvent}
            setIsAddScheduleModalActive={setIsAddScheduleModalActive}
            setUpdateTrigger={setUpdateTrigger}
            isAddScheduleModalActive={isAddScheduleModalActive}
          />
        )}
      </div>
    </div>
  );
}
