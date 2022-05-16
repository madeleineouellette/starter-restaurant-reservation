import React, {useState} from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom";


function EditReservation(){

    const history = useHistory()
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        date: "",
        time: "",
        party_size: ""
    }
    
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (event) => {
        event.preventDefault()
        setFormData((newReservation) => ({
            ...newReservation, [event.target.name]: event.target.value
        }))
    }

    return (
        <div>
            <h2>Edit Reservation:</h2>
            <ReservationForm 
            handleChange={handleChange}
            formData={formData}
            />
        </div>
    )
}

export default EditReservation