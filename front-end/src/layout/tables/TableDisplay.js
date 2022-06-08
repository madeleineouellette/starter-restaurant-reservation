import React, {useState} from "react";
import { finishTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableDisplay({table, loadDashboard}){

    const [showError, setShowError] = useState(null)

    async function handleFinishClick(event) {
        event.preventDefault();
        const abortController = new AbortController()
        setShowError(null)
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
          try {
            await finishTable(table.table_id, abortController.signal)
            window.location.reload(true)
          } catch (error) {
            if (error.name !== "AbortError") setShowError(error)
          }
          return () => abortController.abort()
        }
      }


        return (
            <div className="container-fluid" style={{ width: '18rem' }}>
                <ErrorAlert error={showError} />
                <div>
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title" key={table.table_name}>
                                <h5>Table: <span>{table.table_name}</span></h5>
                            </div>
                            <div className="card-text" key={table.table_id}>
                                <p>ID: <span>{table.table_id}</span></p>
                            </div>
                            <div key={table.status}>
                                <li data-table-id-status={table.table_id}>
                                Status: <span>{table.reservation_id ? "occupied" : "free"}</span>
                                </li>
                                {table.reservation_id ? 
                                <button  
                                className="btn btn-secondary" 
                                data-table-id-finish={table.table_id}
                                onClick={handleFinishClick}
                                >
                                Finish </button> : <p></p>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default TableDisplay;