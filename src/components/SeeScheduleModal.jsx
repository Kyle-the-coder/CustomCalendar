import "../styles/seeschedulemodal.css";
import close from "../assets/close.png";
import { useEffect, useState } from "react";

export function SeeScheduleModal({
  setIsModalActive,
  setIsSeeScheduleModalActive,
  dateOfEvent,
  fullScheduleList,
}) {
  const [dayScheduleList, setDayScheduleList] = useState();

  function closeModal() {
    setIsSeeScheduleModalActive(false);
    setIsModalActive(false);
  }

  useEffect(() => {
    fullScheduleList.map((date) => {
      if (date === dateOfEvent) {
        console.log(dateOfEvent);
        setDayScheduleList(localStorage.getItem(dateOfEvent));
      }
    });
  }, []);

  console.log(dayScheduleList);
  return (
    <div className="see-modal-main-container">
      <div className="modal-container">
        <div className="see-modal-top">
          <h1>Schedule for:</h1>
          <h1>{dateOfEvent}</h1>
          <img
            src={close}
            onClick={() => closeModal()}
            className="modal-close-button"
          />
        </div>
        <div className="see-modal-sched-container">
          <div className="see-sched-container"></div>
        </div>
      </div>
    </div>
  );
}
