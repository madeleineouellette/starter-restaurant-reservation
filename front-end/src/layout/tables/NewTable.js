import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {createTable} from "../../utils/api"
import ErrorAlert from "../ErrorAlert";


function NewTable(){
    const history = useHistory()
    const [showError, setShowError] = useState(null)

    const initialFormData = {
        table_name: "",
        capacity: 0
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
        setShowError(false)
        const newTable = {
            table_name: formData.table_name,
            capacity: Number(formData.capacity)
        }
        await createTable(newTable, abortController.signal)
        setFormData(initialFormData)
        history.push("/")
    }


   return (
       <div className="mb-3 container-fluid">
            <ErrorAlert className="alert alert-danger" error={showError} />
           <h2 className="text-center">New table:</h2>
           <form onSubmit={submitHandler}>
                <div>
                    <label>Table Name:</label>
                    <input 
                    className="form-control"
                    type="text"
                    minLength={2}
                    name="table_name"
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
                    onChange={changeHandler}
                    />
                </div>
                <div className="d-grid col-3 mx-auto">
                <button type="submit" className="btn btn-primary text-white btn-lg">Submit</button>
                <button className="btn btn-secondary text-white btn-lg" onClick={() => history.goBack()}>Cancel</button>
                </div>
           </form>
       </div>
   ) 
}


export default NewTable