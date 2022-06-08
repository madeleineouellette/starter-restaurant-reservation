const service = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


const validProperties = [
  "table_name",
  "capacity"
]


function hasValidProperties(req, res, next){
  const {data} = req.body;
  if(!data){
    return next({status: 400, message: 'Request requires data'})
  }
  
  validProperties.forEach((property) => {
    if(!data[property]){
      return next({ status: 400, message: `Requires ${property}.`})
    }
    if(property === "capacity" && !Number.isInteger(data.capacity)){
      return next({status: 400, message: `${property} field must be in the correct format.`})
  
  }
  if(property === "table_name" && data.table_name.length === 1){
    return next({status: 400, message: `${property} must be longer than one character`})
  }
})
  return next()
}

function validRequest(req, res, next){
  const {data} = req.body
  if(!data){
    return next({
      status: 400,
      message: "Requires data"
    })
  }
  if(!data.reservation_id){
    return next({
      status: 400,
      message: "Requires reservation_id property"
    })
  }
  return next()
}


async function tableExists(req, res, next){
  const { table_id } = req.params
  const table = await service.read(table_id)
  if(table){
    res.locals.table = table
    return next()
  } 
  return next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

async function reservationExists(req, res, next){
  const { reservation_id } = req.body.data
  const reservation = await reservationsService.read(reservation_id)
  if(reservation){
    res.locals.reservation = reservation
    return next()
  } 
  return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
}

function validateTable(req, res, next){
  const table = res.locals.table
  const reservation = res.locals.reservation
  if(table.status === "occupied"){
    return next({
      status: 400,
      message: "The selected table is currently occupied."
    })
  }
  if(reservation.status === "seated"){
    return next({
      status: 400,
      message: "The selected reservation has already been seated."
    })
  }
  if(table.capacity < reservation.people){
    return next({
      status: 400,
      message: `The selected table does not have sufficient capacity to seat ${reservation.people} people.`
    })
  }
  return next()
}

function checkOccupied(req, res, next){
  const status = res.locals.table.status
  if(status !== "occupied"){
    return next({
      status: 400,
      message: "cannot clear table that is not occupied"
    })
  }
  return next()
}


async function list(req, res) {
  res.json({ data: await service.list() })
  }

  async function read(req, res){
    const {table_id} = req.params
    const data = await service.read(table_id)
    res.json({ data })
  }

async function create(req, res){
   const table = await service.create(req.body.data)
   res.status(201).json({data: table})
 }

async function update(req, res) {
  await service.seatTable(res.locals.table.table_id, res.locals.reservation.reservation_id)
  await reservationsService.updateStatus(res.locals.reservation.reservation_id, "seated")
  res.status(200).json({data: { status: "seated" }})
}

async function clearTable(req, res) {

  const table = res.locals.table
  const clearedTable = {...table, reservation_id: null}
  reservationsService.updateStatus(table.reservation_id, "finished");
  const data = await service.update(clearedTable)
  res.json({data})
}

  module.exports = {
      list,
      read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
      create: [hasValidProperties, asyncErrorBoundary(create)],
      update: [validRequest, asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationExists), validateTable, asyncErrorBoundary(update)],
      delete: [asyncErrorBoundary(tableExists), checkOccupied, asyncErrorBoundary(clearTable)]
  }