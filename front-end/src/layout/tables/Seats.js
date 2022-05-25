import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listTables } from "../../utils/api";

function Seats(){
    const history = useHistory()
    const [tablesList, setTablesList] = useState()
    const {reservation_id} = useParams

    useEffect(() => {
        const abortController = new AbortController()
        async function loadTables(){
            const response = await listTables(reservation_id, abortController.signal)
            setTablesList({response})
        }
        loadTables()
    }, [reservation_id])

    const submitHandler = (event) => {
        event.preventDefault()
        console.log("Seats submit handler triggered")
        history.push("/")
    }

    return (
        <div className="container">
            <form onSubmit={submitHandler}>
                {/* <div>
                    {tablesList.map((table) => 
                            <select name="table_id">
                            <option value={table.table_id}>
                                {table.table_name} - {table.capacity}
                            </option>
                           </select>    
                    )}
                <button className="btn btn-primary text-white">Submit</button>
                <button className="btn btn-secondary text-white" onClick={() => history.push("/")}>Cancel</button>
                </div> */}
            </form>
        </div>
    )
}

export default Seats