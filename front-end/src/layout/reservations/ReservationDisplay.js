import React, {useEffect} from "react";
import { useHistory } from "react-router-dom"


function ReservationDisplay({reservations, deleteButtonHandler}){

    function reservationExists(){
      if(!reservations){
        return false
      } else {
        return true
      }
    }
    const history = useHistory()

    useEffect(reservationExists, [])
    
    return (    
     reservationExists ? 
     reservations.map((reservation) => {
      return (
        <div className="container-fluid">
          <div key={reservation.date}>
            <h5>{reservation.reservation_date}</h5>
          </div>
          <div>
            <h6>Time: {reservation.reservation_time}</h6>
          </div>
          <div key={reservation.id}>
            <h6>Reservation Id #{reservation.reservation_id}</h6>
          </div>
          <div>
            <h6>Name on reservation: {reservation.first_name} {reservation.last_name}</h6>
          </div>
          <div>
            <p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p>
          </div>
          <div className="d-grid justify-content-center">
            <button className="btn btn-info" onClick={() => history.push(`/reservations/${reservation.reservation_id}/seat`)}>Seat</button>
            <button className="btn btn-primary" onClick={() => history.push(`/reservations/${reservation.reservation_id}/edit`)}>Edit</button>
            <button className="btn btn-secondary" onClick={() => deleteButtonHandler(reservation.reservation_id)}>Cancel</button>
          </div>
        </div>
      )
     })
        
        : <h6>There are no reservations on this date.</h6>
        )
}

export default ReservationDisplay