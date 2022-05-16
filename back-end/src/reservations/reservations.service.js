const knex = require("../db/connection");


//GET reservations
function list(){
    return knex("reservations").select()
}

//GET reservations/:reservationId

function read(reservation_id){
    return knex("reservations")
        .select()
        .where({reservation_id})
        .first()
}


module.exports = {
    list,
    read,
}