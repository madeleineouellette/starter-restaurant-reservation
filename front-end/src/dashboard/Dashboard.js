import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import TableDisplay from "../layout/tables/TableDisplay"
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { useHistory } from "react-router-dom"
import useQuery from "../utils/useQuery";
import ReservationDisplay from "../layout/reservations/ReservationDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null)
  const [tablesError, setTablesError] = useState(null)
  const history = useHistory()
  const query = useQuery();
  const queryDate = query.get("date")
  const [sameDate, setSameDate] = useState(true)
   

  useEffect(() => {
    if(!queryDate || queryDate === today()){
      setSameDate(true)
    } else {
      setSameDate(false)
    }
  }, [queryDate])

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null)
    setTablesError(null)
    const resDate = queryDate ? queryDate : date
    listTables(abortController.signal).then(setTables).catch(setTablesError)
    listReservations({ date: resDate }, abortController.signal)
      .then(
        data => {
          setReservations(data)
        }
      )
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const onPreviousClick = (event) => {
    if(!queryDate){
      history.push(`dashboard?date=${previous(today())}`)
      window.location.reload(true)
    } else {
    history.push(`dashboard?date=${previous(queryDate)}`)
    window.location.reload(true)
    }
    setSameDate(false)
  }

  const onNextClick = (event) => {
    if(!queryDate){
      history.push(`dashboard?date=${next(today())}`)
      window.location.reload(true)
    } else {
      history.push(`dashboard?date=${next(queryDate)}`)
      window.location.reload(true)
    }
    setSameDate(false)
  }

  
  const TableList = () => {
    return tables?.map((table) => (
      <TableDisplay 
      table={table}
      key={table.table_id}
      />
    ))
  }

  // const ReservationList = () => {
  //   return reservations?.map((reservation) => (
  //     <ReservationDisplay 
  //     reservation={reservation}
  //     key={reservation.reservation_id}
  //     />
  //   ))
  // }

  const reservationList =
  reservations && reservations.length ? 
 (reservations?.map((reservation) => (
    <ReservationDisplay 
    reservation={reservation}
    key={reservation.reservation_id}
    />
  ))) : "No reservations found for this date."
  

  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <div>
        <div className="date-button-container d-grid d-md-flex mb-3">
        <h4 className="col text-center header-bar"> Reservations for {sameDate ? today() : queryDate}</h4>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="d-flex justify-content-between m-4">
          <button className="btn date-button px-3 py-2" onClick={onPreviousClick}>Previous</button>
          <button className="btn date-button px-3 py-2" onClick={() => history.push("/")}>Today</button>
          <button className="btn date-button px-3 py-2" onClick={onNextClick}>Next</button>
        </div>
      <div className="container">
      <div className="row">
        <div className="col">
      <img src="https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=790&q=80" 
      alt="outdoor restaurant" className="rounded float-end" height="700" width="550"/>
      </div>
      <div className="col">
        {/* <ReservationList /> */}
        {reservationList}
      </div>
      </div>
      </div>
      <h4 className="header-bar text-center">Tables</h4>
      <div className="container-fluid">
        <div className="row">
          <TableList />
          </div>
          </div>
    </main>
  );
}

export default Dashboard;
