import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import close from "../../assets/close.png";
import "./clientstyles/booknowform.css";
import gsap from "gsap";

export function BookNowForm({
  dateOfEvent,
  setIsAddScheduleModalActive,
  setUpdateTrigger,
  isAddScheduleModalActive,
  timeBlock,
  setTimeBlock,
}) {
  //STATES FOR FORM
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailableAppt, setIsAvailableAppt] = useState(true);

  function closeModal() {
    const modal = document.querySelector(".book-now-main-container");
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

    // Retrieve the array of objects from localStorage
    const getInfo = localStorage.getItem(dateOfEvent);
    if (getInfo) {
      const eventArray = JSON.parse(getInfo);

      // Find the object that matches the timeBlock
      const updatedArray = eventArray.map((block) => {
        console.log(typeof block);
        if (
          block.startTime === timeBlock.startTime &&
          block.endTime === timeBlock.endTime
        ) {
          // Update the object with new data
          return {
            ...block,
            name: name,
            email: email,
            description: description,
            isAvailableAppt: false,
          };
        }
        return block;
      });

      // Save the updated array back to localStorage
      localStorage.setItem(dateOfEvent, JSON.stringify(updatedArray));
      setUpdateTrigger((prev) => !prev);
    }

    // Clear form fields and close modal
    setName("");
    setEmail("");
    setDescription("");
    setTimeBlock("");
    setIsAvailableAppt(true);
    closeModal();
  }

  useEffect(() => {
    if (isAddScheduleModalActive) {
      const modal = document.querySelector(".book-now-main-container");
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

  const displayStartTime = timeBlock
    ? format(parse(timeBlock.startTime, "HH:mm", new Date()), "hh:mm a")
    : "";
  const displayEndTime = timeBlock
    ? format(parse(timeBlock.endTime, "HH:mm", new Date()), "hh:mm a")
    : "";

  return (
    <div className="book-now-main-container">
      <div className="book-now-top-container">
        <h1>Enter Appt. Info</h1>

        <img
          src={close}
          onClick={() => closeModal()}
          className="book-now-close-button"
        />
      </div>
      <div className="book-now-form-container">
        <form className="book-now-form" onSubmit={addClientToTimeBlock}>
          <div className="book-now-form-input-container">
            <h2>
              Time: {displayStartTime}-{displayEndTime}
            </h2>
          </div>
          <div className="book-now-form-input-container">
            <label className="book-now-text-label">Name:</label>
            <input
              type="text"
              className="book-now-text-input"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="book-now-form-input-container">
            <label className="book-now-text-label">Email:</label>
            <input
              type="text"
              className="book-now-text-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="book-now-form-area-container">
            <label className="book-now-area-label">Description:</label>
            <textarea
              type="text"
              rows="7"
              className="book-now-area-input"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="error-message">{error && error}</div>
          <button type="submit" className="book-now-submit-button">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
