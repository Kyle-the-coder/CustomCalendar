import "../styles/seestimeblockadmin.css";
import tbDelete from "../assets/close.png";
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
  const [timeBlock, setTimeBlock] = useState(null);

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

  function handleTimeBlockClick(sched) {
    setTimeBlock(sched);
  }

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

  function deleteTb(sched) {
    // Retrieve the item from local storage
    const findSched = localStorage.getItem(sched.dateOfEvent);

    if (findSched) {
      // Parse the item as JSON
      const findSchedArray = JSON.parse(findSched);

      // Filter out the specific time block based on the id
      const mapSched = findSchedArray.filter((tb) => tb.id !== sched.id);

      if (mapSched.length > 0) {
        // If the array is not empty, convert the updated array back to a JSON string
        const updatedSchedJSON = JSON.stringify(mapSched);

        // Store the updated JSON string back in local storage
        localStorage.setItem(sched.dateOfEvent, updatedSchedJSON);
      } else {
        // If the array is empty, remove the local storage key
        localStorage.removeItem(sched.dateOfEvent);
      }

      // Update the fullScheduleList state
      setFullScheduleList((prevList) =>
        mapSched.length > 0
          ? prevList
          : prevList.filter((date) => date !== sched.dateOfEvent)
      );

      // Update the dayScheduleList state
      setDayScheduleList(mapSched);

      // Trigger the update effect in the parent component
      setUpdateTrigger((prev) => !prev);
    } else {
      console.error(`No schedule found for date: ${sched.dateOfEvent}`);
    }
  }

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
                  className="tb-container"
                  onClick={() => handleTimeBlockClick(sched)}
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
                    <img
                      src={tbDelete}
                      className="tb-delete"
                      onClick={() => deleteTb(sched)}
                    />
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
