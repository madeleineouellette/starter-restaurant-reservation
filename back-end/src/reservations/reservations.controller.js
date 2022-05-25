const service = require("./reservations.service")
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



 const VALID_PROPERTIES = [
  "first_name",
  "last_name", 
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people" 
]

// const formattedDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
// const formattedTime = /[0-9]{2}:[0-9]{2}/;


//check if reservation properties are valid
function hasValidProperties(req, res, next){
  const data = req.body;
  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))
  if (invalidFields.length){
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`
    })
  }
  next()
}

//check if new reservation has all the required fields filled out
function hasRequiredProperties(req, res, next){
  if(hasProperties(VALID_PROPERTIES, req.body)){
    return next()
  }
  return next({
    status: 400,
    message: `Reservation needs ${field} field`
  })
}

//check if date is before current date AND not a Tuesday
function checkDate(req, res, next){
  const data = req.body
  const reservationDate = new Date(data.reservation_date)
  const parsedDate = Date.parse(reservationDate)
  const currentDate = Date.parse(new Date())
  const dayOfTheWeek = reservationDate.getDay()
  if(parsedDate < currentDate){
    return next({
      status: 400,
      message: "Reservations can only be created on future dates."
    })
  } else if(dayOfTheWeek === 1){
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays."
    })
  }
   next()
}


//check that time is AFTER 10:30AM and BEFORE 9:30PM and not in the past
function checkTime(req, res, next){
  const resTime = req.body.reservation_time
  const data = new Date()
  const hoursNow = data.getHours()
  const minutesNow = data.getMinutes()
  let timeNow = `${hoursNow}:${minutesNow}`

  if(resTime >= "21:30" || resTime <= "10:30" ){
    return next({
      status: 400,
      message: "Please book your reservation between 10:30AM and 9:30PM."
    })
  } else if(resTime < timeNow){
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
  if(reservation){
    return next()
  } 
  return next({ status: 404, message: `Reservation ${req.params.reservation_id} cannot be found.` });
}

//GET all reservations, reservations by date, reservations by phone number for search bar
async function list(req, res) {
  // const { date, mobile_number } = req.query
  // if(date){
  //   res.json({ data: await service.listByDate(date) })
  // } else if(mobile_number){
  //   res.json({ data: await service.searchByPhoneNumber(mobile_number) })
  // } else {
    res.json({ data: await service.list() })
//  }
}

//GET reservations based on reservation Id
async function read(req, res){
  const {reservation_id} = req.params
  const data = await service.read(reservation_id)
  res.json({ data })
}

//POST new reservation
async function create(req, res){
  const reservation = await service.create(req.body)
  res.status(201).json({data: reservation})
}

//PUT existing reservation
async function update(req, res) {
  const {reservation_id} = req.params
  const data = await service.update(reservation_id, req.body)
  res.json({ data });
}

//DELETE existing reservation
async function destroy(req, res) {
  const { reservation_id } = req.params
  await service.destroy(reservation_id)
  res.sendStatus(204)
}


module.exports = {
  list: [list],
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [hasValidProperties, hasRequiredProperties, checkTime, checkDate, asyncErrorBoundary(create)],
  update: [reservationExists, hasValidProperties, checkTime, checkDate, asyncErrorBoundary(update)],
  delete: [reservationExists, asyncErrorBoundary(destroy)]
};
