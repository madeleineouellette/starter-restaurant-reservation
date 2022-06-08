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
  const [reservationsError, setReservationsError] = useState(null);
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
    const resDate = queryDate ? queryDate : date
    listTables(abortController.signal).then(setTables)
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
      loadDashboard={loadDashboard}
      />
    ))
  }

  const ReservationList = () => {
    return reservations?.map((reservation) => (
      <ReservationDisplay 
      reservation={reservation}
      key={reservation.reservation_id}
      />
    ))
  }
  

  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <div>
        <div className="container d-grid d-md-flex mb-3">
        <h4 className="col text-center"> Reservations for {sameDate ? today() : queryDate}</h4>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <ReservationList />
      </div>
      <div className="d-flex justify-content-between m-4">
          <button className="btn btn-secondary px-3 py-2" onClick={onPreviousClick}>Previous</button>
          <button className="btn btn-primary px-3 py-2" onClick={() => history.push("/")}>Today</button>
          <button className="btn btn-secondary px-3 py-2" onClick={onNextClick}>Next</button>
        </div>
      <h4 className="text-center">Tables</h4>
      <div>
        <TableList />
      </div>
        
    </main>
  );
}

export default Dashboard;
