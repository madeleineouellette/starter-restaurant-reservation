import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {createReservation} from "../../utils/api"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../ErrorAlert";

function NewReservation(){
    const history = useHistory()

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "10:30",
        people: 1
    }
    
    const [formData, setFormData] = useState(initialFormData)
    const [showError, setShowError] = useState(false)

    const handleChange = (event) => {
        event.preventDefault()
        setFormData((newReservation) => ({
            ...newReservation, [event.target.name]: event.target.value
        }))
    }

    function formatTime(time) {
        let formatedTime = time.split("");
        formatedTime.splice(5);
        formatedTime = formatedTime.join("");
        return formatedTime;
      }
    

    const submitHandler = async (event) => {
        const abortController = new AbortController()
        event.preventDefault()  
        const dateEntered = Date.parse(formData.reservation_date)
        const day = new Date(dateEntered)
        const dayOfTheWeek = day.getDay()
        const resTime = formatTime(formData.reservation_time)    

        if(dateEntered < Date.now()){
            setShowError(true)
       }

       if(dayOfTheWeek === 1){
           setShowError(true)
       }

       if(resTime >= "21:30" || resTime <= "10:30"){
           setShowError(true)
       }

       

        await createReservation(formData, abortController.signal)
        setFormData(initialFormData)
        history.push(`/dashboard?date=${formData.reservation_date}`)
    }
    return (
        <div>
            <h2>Create A New Reservation:</h2>
            <ErrorAlert error={showError} />
            <ReservationForm 
            handleChange={handleChange}
            submitHandler={submitHandler}
            formData={formData}
            />
        </div>
        )
}



export default NewReservation