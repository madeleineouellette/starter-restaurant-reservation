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

function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((created) => created[0])
}


module.exports = {
    list,
    read,
    create,
}