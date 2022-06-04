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
        .whereNot({status: "finished"})
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
async function create(newReservation){
    return await knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then((created) => created[0])
}

//PUT current reservation
async function update(reservation){
    return await knex("reservations")
        .select("*")
        .where({reservation_id: reservation.reservation_id})
        .update(reservation, "*")
        .then((updated) => updated[0])
}

//PUT changing res status - booked, seated, finished
async function updateStatus(reservation_id, status){
    return await knex("reservations")
    .where({reservation_id})
    .update({status}, "*")
    .then((updated) => updated[0])
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
    updateStatus,
    destroy
}