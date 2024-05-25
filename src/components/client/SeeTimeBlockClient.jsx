import "./clientstyles/seetimeblockclient.css";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { BookNowForm } from "./BookNowForm";

export function SeeTimeBlocksClient({
  setIsModalActive,
  setUpdateTrigger,
  dateOfEvent,
}) {
  const [fullScheduleList, setFullScheduleList] = useState([]);
  const [dayScheduleList, setDayScheduleList] = useState([]);
  const [isSchedLoaded, setIsSchedLoaded] = useState(false);
  const [isAddScheduleModalActive, setIsAddScheduleModalActive] =
    useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [timeBlock, setTimeBlock] = useState(null);

  function handleAddTimeBlockModal() {
    setIsAddScheduleModalActive(true);
  }

  function handleTimeBlockClick(sched) {
    setTimeBlock(sched);
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
              const events = parsedList.map((item) => JSON.parse(item));
              events.sort((a, b) => {
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

  useEffect(() => {
    setTimeBlock("");
  }, [dateOfEvent]);

  return (
    <div className="see-timeblock-client-main-container">
      <div className="timeblock-client-display-container">
        <div className="tbc-display-top">
          <h1>Schedule for:</h1>
          <h1>{dateOfEvent}</h1>
        </div>
        <div className="tbc-sched-container">
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
              const isSelected =
                timeBlock &&
                sched.startTime === timeBlock.startTime &&
                sched.endTime === timeBlock.endTime;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: isSelected
                      ? sched.isAvailableAppt
                        ? "darkGreen"
                        : "darkRed"
                      : hoveredIndex === index
                      ? sched.isAvailableAppt
                        ? "rgb(78, 203, 78)"
                        : "rgb(200, 62, 62)"
                      : sched.isAvailableAppt
                      ? "lightGreen"
                      : "lightCoral",
                  }}
                  className={`tbc-container ${
                    isSelected ? "selected-tbc" : ""
                  }`}
                  onClick={() => handleTimeBlockClick(sched)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <h4 className="tbc">
                    {startTime} - {endTime}
                  </h4>
                  {sched.isAvailableAppt ? (
                    <h4 className="tbc-end">Available</h4>
                  ) : (
                    <h4 className="tbc-end">Booked</h4>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="book-now-button-container">
          <button
            className="tbc-submit-button"
            onClick={() => handleAddTimeBlockModal()}
            disabled={!timeBlock || !timeBlock.isAvailableAppt} // Disable button conditionally
          >
            Book Now
          </button>
          {isAddScheduleModalActive && (
            <BookNowForm
              dateOfEvent={dateOfEvent}
              setIsAddScheduleModalActive={setIsAddScheduleModalActive}
              setUpdateTrigger={setUpdateTrigger}
              isAddScheduleModalActive={isAddScheduleModalActive}
              dayScheduleList={dayScheduleList}
              timeBlock={timeBlock}
              setTimeBlock={setTimeBlock}
            />
          )}
        </div>
      </div>
    </div>
  );
}
