import "../styles/seeschedulemodal.css";
import close from "../assets/close.png";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";

export function SeeScheduleModal({
  setIsModalActive,
  setIsSeeScheduleModalActive,
  dateOfEvent,
  fullScheduleList,
}) {
  const [dayScheduleList, setDayScheduleList] = useState([]);
  const [isSchedLoaded, setIsSchedLoaded] = useState(false);

  function closeModal() {
    setIsSeeScheduleModalActive(false);
    setIsModalActive(false);
  }

  useEffect(() => {
    fullScheduleList.map((date) => {
      if (date === dateOfEvent) {
        console.log(dateOfEvent);
        const eventList = JSON.parse(localStorage.getItem(dateOfEvent));
        console.log(JSON.parse(eventList));
        setDayScheduleList([JSON.parse(eventList)]);
        setIsSchedLoaded(true);
      }
    });
  }, []);

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
              console.log(endTime);
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
      </div>
    </div>
  );
}
