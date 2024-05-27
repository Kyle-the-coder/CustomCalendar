import "../styles/seestimeblockadmin.css";
import close from "../assets/close.png";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { AddTimeBlockDisplay } from "./AddTimeBlockAdmin";

export function SeeTimeBlocksAdmin({ setUpdateTrigger, dateOfEvent }) {
  const [fullScheduleList, setFullScheduleList] = useState([]);
  const [dayScheduleList, setDayScheduleList] = useState([]);
  const [isSchedLoaded, setIsSchedLoaded] = useState(false);
  const [isAddScheduleModalActive, setIsAddScheduleModalActive] =
    useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    const updateDayScheduleList = () => {
      if (dateOfEvent) {
        if (fullScheduleList.includes(dateOfEvent)) {
          const eventList = localStorage.getItem(dateOfEvent);
          if (eventList) {
            try {
              const parsedList = JSON.parse(eventList);
              const events = parsedList.sort((a, b) => {
                const timeA = parse(a.startTime, "HH:mm", new Date());
                const timeB = parse(b.startTime, "HH:mm", new Date());
                return timeA - timeB;
              });
              setDayScheduleList(events);
              setIsSchedLoaded(true);
            } catch (error) {
              console.error("Error parsing JSON data from localStorage", error);
            }
          }
        } else {
          setDayScheduleList([]);
          setIsSchedLoaded(true);
        }
      }
    };

    updateDayScheduleList();
  }, [fullScheduleList, dateOfEvent]);

  return (
    <div className="see-timeblock-main-container">
      <div className="timeblock-display-container">
        <div className="tb-display-top">
          <h1>Schedule for:</h1>
          <h1>{dateOfEvent}</h1>
        </div>
        <div className="tb-sched-container">
          {dayScheduleList.length === 0 ? (
            <h3 style={{ margin: "0 auto", marginTop: "35%" }}>
              No Time Blocks on this Date
            </h3>
          ) : (
            isSchedLoaded &&
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
                          ? "rgb(78, 203, 78)"
                          : "rgb(200, 62, 62)"
                        : sched.isAvailableAppt
                        ? "lightGreen"
                        : "lightCoral",
                  }}
                  className="tb-container"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <h4 className="tb">
                    {startTime} - {endTime}
                  </h4>
                  <div className="tb-delete-container">
                    {sched.isAvailableAppt ? (
                      <h4 className="tb-end">Available</h4>
                    ) : (
                      <h4 className="tb-end">Booked</h4>
                    )}
                    <img src={close} className="tb-delete" />
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="add-schedule-button-container">
          <button
            className="tb-submit-button"
            onClick={() => handleAddTimeBlockModal()}
          >
            Add Time Block
          </button>
          {isAddScheduleModalActive && (
            <AddTimeBlockDisplay
              dateOfEvent={dateOfEvent}
              setIsAddScheduleModalActive={setIsAddScheduleModalActive}
              setUpdateTrigger={setUpdateTrigger}
              isAddScheduleModalActive={isAddScheduleModalActive}
              dayScheduleList={dayScheduleList}
            />
          )}
        </div>
      </div>
    </div>
  );
}
