import "../styles/seeschedulemodal.css";
import close from "../assets/close.png";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { AddScheduleModal } from "./AddScheduleModal";

export function SeeScheduleModal({
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
  }, [dateOfEvent, fullScheduleList, isAddScheduleModalActive, updateTrigger]);

  return (
    <div className="see-modal-main-container">
      <div className="modal-container">
        <div className="see-modal-top">
          <h1>Schedule for:</h1>
          <h1>{dateOfEvent}</h1>
          <img
            src={close}
            onClick={() => closeModal()}
            className="modal-close-button"
          />
        </div>
        <div className="see-modal-sched-container">
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
                    backgroundColor: sched.isAvailableAppt
                      ? "lightGreen"
                      : "red",
                  }}
                  className="see-sched-container"
                >
                  <h1>
                    {startTime} - {endTime}
                  </h1>
                </div>
              );
            })}
        </div>
        <div className="add-schedule-button-container">
          <button
            className="submit-button"
            onClick={() => handleAddTimeBlockModal()}
          >
            Add Time Block
          </button>
        </div>
        {isAddScheduleModalActive && (
          <AddScheduleModal
            dateOfEvent={dateOfEvent}
            setIsAddScheduleModalActive={setIsAddScheduleModalActive}
            setUpdateTrigger={setUpdateTrigger}
          />
        )}
      </div>
    </div>
  );
}
