import React, {useState} from "react";
import { finishTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableDisplay({table}){

    const [showError, setShowError] = useState(null)
    const { capacity, reservation_id, table_id, table_name } = table

    async function handleFinishClick(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message =
          "Is this table ready to seat new guests? This cannot be undone.";
        setShowError(null);
        if (window.confirm(message)) {
          try {
            await finishTable(table_id, abortController.signal);
            window.location.reload(true);
          } catch (error) {
            if (error.name !== "AbortError") setShowError(error);
          }
          return () => abortController.abort();
        }
      }

      const buttonSet = reservation_id ? (
        <div className="d-flex justify-content-center m-3">
          <button
            className="btn btn-danger"
            data-table-id-finish={table_id}
            onClick={handleFinishClick}
          >
            Finish
          </button>
        </div>
      ) : (<p></p>)

        return (
            <div className="container-fluid" style={{ width: '18rem' }}>
                <ErrorAlert error={showError} />
                <div>
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title" key={table_name}>
                                <h5>Table: <span>{table_name}</span></h5>
                            </div>
                            <div className="card-text" key={table_id}>
                                <p>ID: <span>{table_id}</span></p>
                            </div>
                            <div className="card-text" key={capacity}>
                                <p>Capacity: {capacity}</p>
                            </div>
                            <div key={table.status}>
                            <p className="h4 m-3 text-center" data-table-id-status={table_id}>
                                {reservation_id ? "Occupied" : "Free"}
                            </p>
                                <div>{buttonSet}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default TableDisplay;