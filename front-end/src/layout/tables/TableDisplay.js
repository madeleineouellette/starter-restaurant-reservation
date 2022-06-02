import React from "react";

function TableDisplay({tables}){

        const handleFinishClick = (event) => {
            console.log("finish clicked")
        }

        return (
            tables?.map((table) => 
            <div className="container-fluid" style={{ width: '18rem' }}>
                <div>
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title">
                                <h5>Table: <span>{table.table_name}</span></h5>
                            </div>
                            <div className="card-text">
                                <p>ID: <span>{table.table_id}</span></p>
                            </div>
                            <div>
                                <li data-table-id-status={table.table_id}>
                                Status: <span>{table.reservation_id ? "Occupied" : "Free"}</span>
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
        )
}

export default TableDisplay;