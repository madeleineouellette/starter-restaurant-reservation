import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ handleChange, submitHandler, formData }){
    const history = useHistory()
    
    
    return (
        <div className="mb-3 container-fluid">
            <form onSubmit={submitHandler}>
                <div>
                    <label>First Name:</label>
                    <input 
                    className="form-control"
                    name="first_name" 
                    minLength={1}
                    onChange={handleChange}
                    value={formData.first_name}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input 
                    className="form-control"
                    name="last_name" 
                    minLength={1}
                    onChange={handleChange}
                    value={formData.last_name}
                    />
                </div>
                <div>
                    <label>Mobile Number:</label>
                    <input 
                    className="form-control"
                    type="tel"
                    name="mobile_number" 
                    minLength={10}
                    maxLength={10}
                    placeholder="(---) --- ----"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    />
                </div>
                <div>
                    <label>Date of reservation:</label>
                    <input 
                    className="form-control"
                    type="date"
                    placeholder="YYYY-MM-DD" 
                    pattern="\d{4}-\d{2}-\d{2}"
                    name="reservation_date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    />
                    
                </div>
                <div>
                    <label>Time of reservation:</label>
                    <input 
                    className="form-control"
                    type="time"
                    placeholder="HH:MM" 
                    pattern="[0-9]{2}:[0-9]{2}"
                    name="reservation_time" 
                    onChange={handleChange}
                    value={formData.reservation_time}
                    />
                </div>
                <div>
                    <label>Number of people in party:</label>
                    <input 
                    className="form-control my-2" 
                    name="people" 
                    min={1} 
                    max={15} 
                    placeholder={1} 
                    value={formData.people} 
                    type="number" 
                    onChange={handleChange} 
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



export default ReservationForm