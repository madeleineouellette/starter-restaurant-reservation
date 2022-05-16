import React from "react";
import { useHistory } from "react-router-dom";
import {createReservation} from "../../utils/api"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../ErrorAlert";
import useState from "react-usestateref"

function NewReservation(){
    
    const history = useHistory()
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        date: "",
        time: "",
        party_size: ""
    }
    
    const [formData, setFormData, formDataRef] = useState({})
    const [showError, setShowError, showErrorRef] = useState({})
    let message = {}

    const handleChange = (event) => {
        event.preventDefault()
        setFormData((newReservation) => ({
            ...newReservation, [event.target.name]: event.target.value
        }))
    }

    const submitHandler = async (event) => {
        const abortController = new AbortController()
        event.preventDefault()  

        const dateEntered = Date.parse(formData.date)
        const day = new Date(dateEntered)
        const dayOfTheWeek = day.getDay()
        
        const hours = day.getHours()
        console.log(day, hours)


        if(dateEntered < Date.now()){
            message.message = "Date is in the past."
            setShowError(message)
       }

       if(dayOfTheWeek === 1){
           console.log("inside tuesday if")
           message.message = "Restaurant is closed on Tuesdays."
           console.log(message)
           setShowError(message)
       }

        await createReservation(formData, abortController.signal)
        setFormData({})
        history.push(`/dashboard?date=${formData.date}`)
    }
    console.log(message)
    return (
        <div>
            <h2>Create A New Reservation:</h2>
            <ErrorAlert error={showErrorRef.current} />
            <ReservationForm 
            handleChange={handleChange}
            submitHandler={submitHandler}
            formData={formData}
            />
        </div>
        )
}



export default NewReservation