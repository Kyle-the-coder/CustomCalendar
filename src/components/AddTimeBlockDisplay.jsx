import { useEffect, useState } from "react";
import close from "../assets/close.png";
import "../styles/schedulemodal.css";
import gsap from "gsap";
export function AddTimeBlockDisplay({
  dateOfEvent,
  setIsAddScheduleModalActive,
  setUpdateTrigger,
  isAddScheduleModalActive,
  dayScheduleList,
}) {
  //STATES FOR FORM
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAvailableAppt, setIsAvailableAppt] = useState(true);
  const [error, setError] = useState(false);
  const [splitIntoHourBlocks, setSplitIntoHourBlocks] = useState(false);

  function closeModal() {
    const modal = document.querySelector(".modal-container");
    if (modal) {
      gsap.fromTo(
        modal,
        {
          x: "0%",
          duration: 1.2,
          ease: "power4.inOut",
        },
        {
          x: "100%",
          visibility: "visible",
          boxShadow: "none",
          onComplete: () => {
            setIsAddScheduleModalActive(false);
          },
        }
      );
    }
  }

  function addDatesToStorage(e) {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    if (!startTime && !endTime) {
      setError("Start time and End Time are empty.");
      return;
    } else if (!startTime) {
      setError("Start Time is empty");
      return;
    } else if (!endTime) {
      setError("End time is empty.");
      return;
    }

    // Validation: Ensure startTime is before endTime
    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      return;
    }

    // Validation: Ensure the time block doesn't already exist
    const timeConflict = dayScheduleList.some((sched) => {
      return (
        (startTime >= sched.startTime && startTime < sched.endTime) ||
        (endTime > sched.startTime && endTime <= sched.endTime) ||
        (startTime <= sched.startTime && endTime >= sched.endTime)
      );
    });

    if (timeConflict) {
      setError("This time block conflicts with an existing one.");
      return;
    }

    // Helper function to create event blocks
    const createEventBlock = (start, end) => ({
      endTime: end,
      startTime: start,
      dateOfEvent: dateOfEvent,
      isAvailableAppt: isAvailableAppt,
    });

    let eventBlocks = [];

    if (splitIntoHourBlocks) {
      let currentStartTime = new Date(`1970-01-01T${startTime}:00`);
      let currentEndTime = new Date(
        currentStartTime.getTime() + 60 * 60 * 1000
      );

      while (currentEndTime <= new Date(`1970-01-01T${endTime}:00`)) {
        eventBlocks.push(
          createEventBlock(
            currentStartTime.toTimeString().slice(0, 5),
            currentEndTime.toTimeString().slice(0, 5)
          )
        );

        currentStartTime = new Date(
          currentStartTime.getTime() + 60 * 60 * 1000
        );
        currentEndTime = new Date(currentEndTime.getTime() + 60 * 60 * 1000);
      }
    } else {
      eventBlocks.push(createEventBlock(startTime, endTime));
    }

    const getInfo = localStorage.getItem(dateOfEvent);

    let newArray;
    if (getInfo === null) {
      newArray = eventBlocks.map((block) => block);
    } else {
      newArray = JSON.parse(getInfo);
      eventBlocks.forEach((block) => newArray.push(block));
    }

    localStorage.setItem(dateOfEvent, JSON.stringify(newArray));

    setStartTime(null);
    setEndTime(null);
    setIsAvailableAppt(true);
    setSplitIntoHourBlocks(false);
    setUpdateTrigger((prev) => !prev);
    closeModal();
  }

  useEffect(() => {
    if (isAddScheduleModalActive) {
      const modal = document.querySelector(".modal-container");
      gsap.fromTo(
        modal,
        { x: "100%", visibility: "visible", boxShadow: "none" },
        {
          x: "0%",
          duration: 1.2,
          ease: "power4.out",
        }
      );
    }
  }, []);

  return (
    <div className="modal-container">
      <div className="modal-top">
        <h1>Enter A Time Block</h1>

        <img
          src={close}
          onClick={() => closeModal()}
          className="modal-close-button"
        />
      </div>
      <div className="modal-form-container">
        <form className="form" onSubmit={addDatesToStorage}>
          <div className="modal-form-input-container">
            <label className="text-label">Start Time:</label>
            <input
              type="time"
              className="text-input"
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">End Time:</label>
            <input
              type="time"
              className="text-input"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">Availability:</label>
            <select
              className="text-input"
              onChange={(e) => setIsAvailableAppt(e.target.value === "true")}
            >
              <option value={true}>Open</option>
              <option value={false}>Closed</option>
            </select>
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">Split into 1-hour blocks:</label>
            <input
              type="checkbox"
              onChange={(e) => setSplitIntoHourBlocks(e.target.checked)}
            />
          </div>
          <div className="error-message">{error && error}</div>
          <button type="submit" className="submit-button">
            Save Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
