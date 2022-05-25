import React, {useState, useEffect} from "react";
import ReservationForm from "./ReservationForm";
import { readReservation } from "../../utils/api";
import { useParams } from "react-router";


function EditReservation(){
    const {reservation_id} = useParams()
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        date: "",
        time: "",
        party_size: ""
    }
    
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        const abortController = new AbortController()
        async function loadReservation(){
            const response = await readReservation(reservation_id, abortController.signal)
            setFormData({...response})
        }
        loadReservation()
    }, [reservation_id])

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