import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import TableDisplay from "../layout/tables/TableDisplay"
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { useHistory, Link } from "react-router-dom"
import useQuery from "../utils/useQuery";

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
   // setReservationsError(null);
    listTables(abortController.signal).then(setTables)
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const onPreviousClick = (event) => {
    if(!queryDate){
      history.push(`dashboard?date=${previous(today())}`)
    } else {
    history.push(`dashboard?date=${previous(queryDate)}`)
    }
    setSameDate(false)
  }

  const onNextClick = (event) => {
    if(!queryDate){
      history.push(`dashboard?date=${next(today())}`)
    } else {
      history.push(`dashboard?date=${next(queryDate)}`)
    }
    setSameDate(false)
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
      <h4>Reservations</h4>
      <div>
        {reservations?.map((reservation) => 
        <div className="card">
          <div key={reservation.date}>
            <h5>{reservation.reservation_date}</h5>
          </div>
          <div key={reservation.id}>
            <h5>{reservation.reservation_id}</h5>
          </div>
          <div>
            <p data-reservation-id-status={reservation.reservation_id}>Booked</p>
          </div>
          <div>
            <Link className="btn btn-secondary" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
          </div>
          <div>
            <Link className="btn btn-secondary" to={`/reservations/${reservation.reservation_id}/edit`}>Edit</Link>
          </div>
        </div>
        )}
      </div>
      <h4>Tables</h4>
      <div>
        <TableDisplay tables={tables}/>
      </div>
      <div className="d-flex justify-content-between m-4">
          <button className="btn btn-secondary px-3 py-2" onClick={onPreviousClick}>Previous</button>
          <button className="btn btn-primary px-3 py-2" onClick={() => history.push(`dashboard?date=${today()}`)}>Today</button>
          <button className="btn btn-secondary px-3 py-2" onClick={onNextClick}>Next</button>
        </div>
        
    </main>
  );
}

export default Dashboard;
