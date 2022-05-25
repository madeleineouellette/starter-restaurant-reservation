import React from "react";

function TableDisplay({tables}){
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
                        </div>
                    </div>
                </div>
            </div>
            )
        )
}

export default TableDisplay;