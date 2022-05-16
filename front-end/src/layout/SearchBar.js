import React, {useState} from "react";

function SearchBar(){

    const [mobileNumber, setMobileNumber] = useState()

    const findHandler = async (event) => {
        event.preventDefault()
        console.log("SEARCH BAR find button triggered")
    }

    const mobileNumberChangeHandler = (event) => {
        console.log(mobileNumber)
        setMobileNumber(event.target.value)
    }

    return (
    <div> 
        <h3>Search by Mobile Number</h3>
        <form onSubmit={findHandler}>
        <div>
        <input
            className="form-control"
            type="tel"
            label="Search"
            placeholder="Enter a customer's phone number"
            value={mobileNumber}
            onChange={mobileNumberChangeHandler}
        />
        </div>
        <div>
          <button type="submit">Find</button>
      </div>
      </form>
    </div>
    )
}

export default SearchBar