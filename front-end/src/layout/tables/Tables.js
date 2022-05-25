import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {createTable} from "../../utils/api"



function Tables(){
    const history = useHistory()
    const initialFormData = {
        table_name: "",
        capacity:"" 
    }
    const [formData, setFormData] = useState(initialFormData)

    const changeHandler = (event) => {
        event.preventDefault()
        setFormData((newTable) => ({
            ...newTable, [event.target.name]: event.target.value
        }))
    }

    const submitHandler = async (event) => {
        const abortController = new AbortController()
        event.preventDefault()  
        console.log("TABLES submit handler triggered")
        await createTable(formData, abortController.signal)
        setFormData(initialFormData)
        history.push("/")
    }


   return (
       <div className="mb-3 container-fluid">
           <h2 className="text-center">New table:</h2>
           <form onSubmit={submitHandler}>
                <div>
                    <label>Table Name:</label>
                    <input 
                    className="form-control"
                    type="text"
                    minLength={2}
                    name="table_name"
                    value={formData.table_name}
                    onChange={changeHandler}
                    />
                </div>
                <div>
                    <label>Capacity:</label>
                    <input 
                    className="form-control"
                    name="capacity" 
                    min={1} 
                    placeholder={1} 
                    type="number"
                    value={formData.capacity}
                    onChange={changeHandler}
                    />
                </div>
                <div className="d-grid col-3 mx-auto">
                <button type="submit" className="btn btn-primary text-white btn-lg">Submit</button>
                <button className="btn btn-secondary text-white btn-lg" onClick={() => history.push("/")}>Cancel</button>
                </div>
           </form>
       </div>
   ) 
}


export default Tables