import "../styles/seeschedulemodal.css";
import close from "../assets/close.png";
import { useState } from "react";

export function SeeScheduleModal({
  setIsModalActive,
  setIsSeeScheduleModalActive,
}) {
  const [dayScheduleList, setDayScheduleList] = useState();

  function closeModal() {
    setIsSeeScheduleModalActive(false);
    setIsModalActive(false);
  }
  return (
    <div className="see-modal-main-container">
      <div className="modal-container">
        <div className="see-modal-top">
          <h1>Schedule for:</h1>
          <h3>05/13/32</h3>
          <img
            src={close}
            onClick={() => closeModal()}
            className="modal-close-button"
          />
        </div>
        <div className="see-modal-shed-container">
          <div className="see-sched-container"></div>
        </div>
      </div>
    </div>
  );
}
