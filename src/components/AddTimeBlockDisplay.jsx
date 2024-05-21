import { useEffect, useState } from "react";
import close from "../assets/close.png";
import "../styles/schedulemodal.css";
import gsap from "gsap";
export function AddTimeBlockDisplay({
  dateOfEvent,
  setIsAddScheduleModalActive,
  setUpdateTrigger,
  isAddScheduleModalActive,
}) {
  //STATES FOR FORM
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAvailableAppt, setIsAvailableAppt] = useState(true);

  function closeModal() {
    setIsAddScheduleModalActive(false);
  }

  function addDatesToStorage(e) {
    e.preventDefault();
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
    setIsAddScheduleModalActive(false);
  }

  useEffect(() => {
    if (isAddScheduleModalActive) {
      gsap.from(".modal-container", {
        x: "-100%",
        duration: 1.2,
        ease: "power3.inOut",
      });
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
          <button type="submit" className="submit-button">
            Save Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
