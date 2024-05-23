import { useEffect, useState } from "react";
import close from "../../assets/close.png";
import "../../styles/schedulemodal.css";
import gsap from "gsap";
export function BookNowForm({
  dateOfEvent,
  setIsAddScheduleModalActive,
  setUpdateTrigger,
  isAddScheduleModalActive,
  dayScheduleList,
  timeBlock,
  setTimeBlock,
}) {
  //STATES FOR FORM
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailableAppt, setIsAvailableAppt] = useState(true);

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

  function addClientToTimeBlock(e) {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    // Helper function to create event blocks
    const createEventBlock = {
      dateOfEvent: dateOfEvent,
      isAvailableAppt: isAvailableAppt,
      name: name,
      email: email,
      description: description,
    };

    const getInfo = localStorage.getItem(dateOfEvent);

    let newArray;
    if (getInfo === null) {
      newArray = eventBlocks.map((block) => JSON.stringify(block));
    } else {
      newArray = JSON.parse(getInfo);
      eventBlocks.forEach((block) => newArray.push(JSON.stringify(block)));
    }

    localStorage.setItem(dateOfEvent, JSON.stringify(newArray));

    setName("");
    setEmail("");
    setDescription("");
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
        <form className="form" onSubmit={addClientToTimeBlock}>
          <div className="modal-form-input-container">
            <label className="text-label">Name:</label>
            <input
              type="text"
              className="text-input"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">Email:</label>
            <input
              type="text"
              className="text-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">Description:</label>
            <textarea
              type="text"
              className="text-input"
              onChange={(e) => setEmail(e.target.value)}
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
