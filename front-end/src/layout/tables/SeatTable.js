import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, seatReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function SeatTable(){
    const history = useHistory()
    const [tablesList, setTablesList] = useState([])
    const {reservation_id} = useParams()
    const [tableId, setTableId] = useState(0)
    const [showError, setShowError] = useState(null)

    useEffect(() => {
        const abortController = new AbortController()
        async function loadTables(){
            const response = await listTables(abortController.signal)
            const result = response.filter((table) => table.status !== "occupied")
            setTablesList(result)
        }
        loadTables()
    }, [reservation_id]) 


    function handleChange(event) {
        setTableId(event.target.value)
    }

    const submitHandler = async (event) => {
        const abortController = new AbortController()
        setShowError(false)
        event.preventDefault()
        await seatReservation(reservation_id, tableId, abortController.signal)
        history.push("/dashboard")
    }


    const tableOptions = tablesList.map((table) => {
        return (
        <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
         </option>
        )
        }
    )
    
    return (
        <div>
            <ErrorAlert error={showError} />
            <h3>Seating for Reservation #{reservation_id}</h3>
                 <form onSubmit={submitHandler}>
                    <select onChange={handleChange} name="table_id">
                         {tableOptions}
                     </select>
                    <button className="btn btn-primary text-white" type="submit">Submit</button>
                    <button className="btn btn-secondary text-white" onClick={() => history.push("/")}>Cancel</button>
                </form>
        </div>
    )
}

export default SeatTable