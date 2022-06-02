import React, {useState, useEffect} from "react";
import { listReservations } from "../utils/api";
import ReservationDisplay from "./reservations/ReservationDisplay";

function SearchBar(){
    const initialNumber = {
        mobile_number: "",
    }
    const [form, setForm] = useState(initialNumber)
    const [reservations, setReservations] = useState([])

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

    async function findHandler(event){
        event.preventDefault()
        const abortController = new AbortController()
        const searchParameters = {
            mobile_number: form.mobile_number
        }
        setForm(initialNumber)

        const response = await listReservations(searchParameters, abortController.signal) 
        setReservations(response)

        console.log("SEARCH BAR find button triggered")
    }

    const searchResults = reservations.length > 0 ? reservations.map((reservation) => {
     return (
         <ReservationDisplay 
         key={reservation.reservation_id}
         reservation={reservation}
         />
     )   
    }) : <h4>No reservations found!</h4>
    

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
      <div>{searchResults}</div>
      </form>
    </div>
    )
}

export default SearchBar