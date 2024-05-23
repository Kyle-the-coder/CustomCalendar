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

    // If no validation errors, proceed to store the event
    const eventInfo = {
      endTime: endTime,
      startTime: startTime,
      dateOfEvent: dateOfEvent,
      isAvailableAppt: isAvailableAppt,
    };

    const storeEventInfo = JSON.stringify(eventInfo);
    const getInfo = localStorage.getItem(dateOfEvent);

    if (getInfo === null) {
      const newArray = [storeEventInfo];
      localStorage.setItem(dateOfEvent, JSON.stringify(newArray));
    } else {
      const newArray = JSON.parse(getInfo);
      newArray.push(storeEventInfo);
      localStorage.setItem(dateOfEvent, JSON.stringify(newArray));
    }

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
          <h4 className="modal-form-date">{dateOfEvent}</h4>
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button">
            Save Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
