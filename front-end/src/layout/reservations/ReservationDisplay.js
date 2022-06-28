import React, {useState} from "react";
import { updateStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";


function ReservationDisplay({reservation}){
    const [showError, setShowError] = useState(null);

    async function deleteButtonHandler(event) {
      event.preventDefault();
      const abortController = new AbortController()
      if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
        try {
          await updateStatus(reservation.reservation_id, "cancelled", abortController.signal)
          window.location.reload(true)
        } catch (error) {
          if (error.name !== "AbortError") setShowError(error)
        }
      }
    }
    
    return (
     <div className="container">
        {reservation.status === "cancelled" ? null : (
      <div className="dashboard-res-container">
      <ErrorAlert error={showError} />
      <span class="border">
      <div key={reservation.reservation_date}>
        <h5>{reservation.reservation_date}</h5>
      </div>
      <div>
        <h6>Time: {reservation.reservation_time}</h6>
      </div>
      <div key={reservation.reservation_id}>
        <h6>Reservation Id #{reservation.reservation_id}</h6>
      </div>
      <div key={reservation.first_name}>
        <h6>Name on reservation: {reservation.first_name} {reservation.last_name}</h6>
      </div>
      <div key={reservation.capacity}>
        <h6>Capacity: {reservation.people}</h6>
      </div>
      <div key={reservation.status}>
        <p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p>
      </div>
      <div className="d-grid justify-content-center">
        {reservation.status === "booked" ? (
          <button className="btn res-button">
          <a href={`/reservations/${reservation.reservation_id}/seat`} style={{ color: "white"}}>
            Seat
        </a>
        </button>
        ) : null}
        <button className="btn res-button">
        <a href={`/reservations/${reservation.reservation_id}/edit`} style={{ color: "white"}}>
            Edit
          </a>
        </button>
        <button className="btn res-button" style={{ color: "white"}} data-reservation-id-cancel={reservation.reservation_id} onClick={deleteButtonHandler}>Cancel</button>
      </div> 
      </span>
      </div>
    )} 
    </div>   
      )
}

export default ReservationDisplay