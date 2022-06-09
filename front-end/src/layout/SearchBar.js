import React, {useState, useEffect} from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationDisplay from "./reservations/ReservationDisplay";

function SearchBar(){
    const initialNumber = {
        mobile_number: "",
    }
    const [form, setForm] = useState(initialNumber)
    const [reservations, setReservations] = useState([])
    const [showError, setShowError] = useState(null)

    useEffect(() => {
        const initialForm = {
            mobile_number: "",
        }
        setForm(initialForm)
        setReservations([])
    }, [])

    const mobileNumberChangeHandler = ({target}) => {
        setForm({...form, [target.name]: target.value})
    }

    const reservationList =
        reservations && reservations.length ? 
       (reservations?.map((reservation) => (
          <ReservationDisplay 
          reservation={reservation}
          key={reservation.reservation_id}
          />
        ))) : "No reservations found!"
      

    async function findHandler(event){
        event.preventDefault()
        const abortController = new AbortController()
        const parameters = {mobile_number: form.mobile_number}
        setForm(initialNumber)
        setShowError(null)
        const response = await listReservations(parameters, abortController.signal)
        setReservations(response)
    }

    return (
    <div> 
        <h3>Search by Mobile Number</h3>
        <form onSubmit={findHandler}>
        <div>
        <input
            className="form-control"
            type="tel"
            label="Search"
            placeholder="Enter a customer's phone number"
            name="mobile_number"
            onChange={mobileNumberChangeHandler}
        />
        </div>
        <div>
          <button type="submit">Find</button>
      </div>
      </form>
      <ErrorAlert error={showError} />
        <div>{reservationList}</div>
    </div>
    )
}

export default SearchBar