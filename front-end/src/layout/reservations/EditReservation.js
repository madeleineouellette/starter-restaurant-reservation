import React, {useState, useEffect} from "react";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservation } from "../../utils/api";
import { useParams, useHistory } from "react-router";
import { formatAsDate, formatAsTime } from "../../utils/date-time"
import ErrorAlert from "../ErrorAlert";


function EditReservation(){
    const {reservation_id} = useParams()
    const [showError, setShowError] = useState(null)
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

    useEffect(() => {
        const abortController = new AbortController()
        async function loadReservation(){
            const response = await readReservation(reservation_id, abortController.signal)
            setFormData({...response, reservation_date: formatAsDate(response.reservation_date), 
                reservation_time: formatAsTime(response.reservation_time), people: parseInt(response.people)})
        }
        loadReservation()
    }, [reservation_id])

    const handleChange = (event) => {
        event.preventDefault()
        setFormData((newReservation) => ({
            ...newReservation, [event.target.name]: event.target.value
        }))
    }

    const submitHandler = async (event) => {
        const abortController = new AbortController()
        setShowError(false)
        event.preventDefault()
        await updateReservation(formData, abortController.signal)
        history.push(`/dashboard?date=${formData.reservation_date}`)
    }

    return (
        <div>
            <h2>Edit Reservation:</h2>
            <ErrorAlert error={showError} />
            <ReservationForm 
            handleChange={handleChange}
            submitHandler={submitHandler}
            formData={formData}
            />
        </div>
    )
}

export default EditReservation