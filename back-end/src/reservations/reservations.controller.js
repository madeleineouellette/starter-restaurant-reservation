const service = require("./reservations.service")
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



 const validProperties = [
  "first_name",
  "last_name", 
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people" 
]

const dates = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const formattedDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
const formattedTime = /[0-9]{2}:[0-9]{2}/;


//check if reservation properties are valid
function hasValidProperties(req, res, next){
  const {data}  = req.body
  if(!data){
    return next({status: 400, message: 'Request requires data'})
  }
  if(data.status && data.status !== "booked"){
    return next({status: 400, message: `Status field cannot be ${data.status}`})
  }

  validProperties.forEach((property) => {
    if(!data[property]){
      return next({ status: 400, message: `Requires ${property}.`})
    }
    if(property === "people" && !Number.isInteger((data.people))){
      return next({status: 400, message: `${property} field must be in the correct format.`})
    }
    if(property === "reservation_date" && !formattedDate.test(data.reservation_date)){
      return next({status: 400, message: `Requires ${property} to be formatted as YYYY-MM-DD.`})
    }
    if(property === "reservation_time" && !formattedTime.test(data.reservation_time)){
      return next({status: 400, message: `Requires ${property} to be formatted as HH:MM.`})
    }
  })
  return next()
}

//check if date is before current date AND not a Tuesday
function checkDate(req, res, next){
  const {data} = req.body
  const reservationDate = new Date(`${data.reservation_date} ${data.reservation_time}`)
  const currentDate = new Date()
  const dayofWeek = dates[reservationDate.getDay()]
  const timeOfDay = data.reservation_time
  const hoursNow = currentDate.getHours()
  const minutesNow = currentDate.getMinutes()
  let timeNow = `${hoursNow}:${minutesNow}`

  if(reservationDate < currentDate && dayofWeek === "Tuesday"){
    return next({
      status: 400,
      message: "Reservations can only be created on a future date and the restaurant is closed on Tuesdays."
    })
  }

  if(reservationDate < currentDate){
    return next({
      status: 400,
      message: "Reservations can only be created on future dates."
    })
  }  
  if(dayofWeek === "Tuesday"){
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays."
    })
  }
  if(timeOfDay >= "21:30" || timeOfDay <= "10:30" ){
    return next({
      status: 400,
      message: "Please book your reservation between 10:30AM and 9:30PM."
    })
  }
  if(timeOfDay < timeNow && reservationDate < currentDate){
    return next({
      status: 400,
      message: "Please book your reservation for a time in the future."
    })
  }
  return next()
}


//check if reservation exists based on ID#
async function reservationExists(req, res, next){
  const { reservation_id } = req.params
  const reservation = await service.read(reservation_id)
  if(!reservation){
    return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` })
  } 
  res.locals.reservation = reservation
  return next()
}

//check res status

function hasValidStatus(req, res, next){

  if(!req.body.data.status){
    return next({
      status: 400, message: "Status field cannot be empty."
    })
  }

  if(
    req.body.data.status !== "booked" &&
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "cancelled"
  ){ 
    return next({
      status: 400, message: `status field cannot be unknown`
    })
  }


  if(res.locals.reservation.status === "finished"){
    return next({
      status: 400,
      message: "A 'finished' reservation cannot be updated."
    })
  }
  next()
}

//GET all reservations, reservations by date, reservations by phone number for search bar
async function list(req, res) {
  const { date, mobile_number } = req.query
  if(date){
    res.json({ data: await service.listByDate(date) })
  } else if(mobile_number){
    res.json({ data: await service.searchByPhoneNumber(mobile_number) })
  } else {
    res.json({ data: await service.list() })
  }
}

//GET reservations based on reservation Id
async function read(req, res){
  const {reservation_id} = req.params
  const data = await service.read(reservation_id)
  res.json({ data })
}

//POST new reservation
async function create(req, res){
  const newReservation = await service.create(req.body.data)
  res.status(201).json({data: newReservation})
}

//PUT existing reservation
async function update(req, res) {
  const updated = await service.update(req.body.data)
  res.status(200).json({ data: updated });
}

//PUT update res status
async function updateResStatus(req, res){
  const updated = await service.updateStatus(res.locals.reservation.reservation_id, req.body.data.status)
  res.status(200).json({data: updated})
}

//DELETE existing reservation
async function destroy(req, res) {
  const { reservation_id } = req.params
  await service.destroy(reservation_id)
  res.sendStatus(204)
}


module.exports = {
  list: [list],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [hasValidProperties, checkDate, asyncErrorBoundary(create)],
  updateStatus: [asyncErrorBoundary(reservationExists), hasValidStatus, asyncErrorBoundary(updateResStatus)],
  update: [asyncErrorBoundary(reservationExists), hasValidProperties, checkDate, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)]
};
