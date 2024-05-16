import close from "../assets/close.png";
import "../styles/schedulemodal.css";
export function AddScheduleModal({ dateOfEvent, setIsAddScheduleModalActive }) {
  function closeModal() {
    setIsAddScheduleModalActive(false);
  }
  return (
    <div className="modal-main-container">
      <div className="modal-container">
        <div className="modal-top">
          <h1>Enter Your Schedule</h1>

          <img
            src={close}
            onClick={() => closeModal()}
            className="modal-close-button"
          />
        </div>
        <div className="modal-form-container">
          <h4 className="modal-form-date">{dateOfEvent}</h4>
          <div className="modal-form-input-container">
            <label className="text-label">Name:</label>
            <input type="text" className="text-input" />
          </div>

          <div className="modal-form-input-container">
            <label className="text-label">Start Time:</label>
            <input type="time" className="text-input" />
          </div>
          <div className="modal-form-input-container">
            <label className="text-label">End Time:</label>
            <input type="time" className="text-input" />
          </div>
          <button className="submit-button">Save Schedule</button>
        </div>
      </div>
    </div>
  );
}
