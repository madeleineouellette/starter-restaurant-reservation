const knex = require("../db/connection");

//GET all reservations
function list(){
    return knex("reservations").select("*")
}

//GET reservation based on ID
function read(reservation_id){
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .first()
}

//GET - list by date 
function listByDate(reservation_date){
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .orderBy("reservation_time")
}

//GET - search by phone number
function searchByPhoneNumber(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

//POST new reservation
function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((created) => created[0])
}

//PUT current reservation
function update(reservation_id, updatedReservation){
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .update(updatedReservation, "*")
}

//DELETE current reservation
function destroy(reservation_id){
    return knex("reservations")
        .where({reservation_id: reservation_id})
        .del()
}


module.exports = {
    list,
    read,
    searchByPhoneNumber,
    listByDate,
    create,
    update,
    destroy
}