import React, {useState} from "react";
import { useHistory } from "react-router";

function Seats(){

    const history = useHistory()

    const submitHandler = (event) => {
        event.preventDefault()
        console.log("Seats submit handler triggered")
        history.push("/")
    }

    return (
        <div className="container">
            <form onSubmit={submitHandler}>
                <div>
                    <label>Table Number:</label>
                    <select name="table_id">
                    <option value="{table.table_name} - {table.capacity}">
                        Table Name - Table Capacity
                    </option>
                    </select>
                </div>
                <button className="btn btn-primary text-white">Submit</button>
                <button className="btn btn-secondary text-white" onClick={() => history.push("/")}>Cancel</button>
            </form>
        </div>
    )
}

export default Seats