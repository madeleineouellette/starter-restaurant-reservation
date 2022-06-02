import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables } from "../../utils/api";

function Seats(){
    const history = useHistory()
    const [tablesList, setTablesList] = useState([])
    const {reservation_id} = useParams()


    function loadTables(){
        const abortController = new AbortController();
        listTables(abortController.signal).then(setTablesList)
    }

    useEffect(loadTables, [reservation_id])

    const submitHandler = (event) => {
        event.preventDefault()
        console.log("Seats submit handler triggered")
        history.push("/")
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
            <h3>Seating for Reservation #{reservation_id}</h3>
                 <form onSubmit={submitHandler}>
            <select>
                {tableOptions}
            </select>
            <button className="btn btn-primary text-white">Submit</button>
             <button className="btn btn-secondary text-white" onClick={() => history.push("/")}>Cancel</button>
            </form>
        </div>
    )
}

export default Seats