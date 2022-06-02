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

async function validRequest(req, res, next){
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
}


async function tableExists(req, res, next){
  const { table_id } = req.params
  const table = await service.read(table_id)
  if(table){
    return next()
  } 
  return next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

async function reservationExists(req, res, next){
  const { reservation_id } = req.params
  const reservation = await reservationsService.read(reservation_id)
  if(reservation){
    return next()
  } 
  return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
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
  const reservation_id = req.body.reservation_id
  console.log(reservation_id)

  // const {table_id} = req.params
  // const data = await service.update(table_id, req.body)
  // res.json({ data });
}

async function destroy(req, res) {
  const { table_id } = req.params
  await service.destroy(table_id)
  res.sendStatus(204)
}

  module.exports = {
      list,
      read: [tableExists, asyncErrorBoundary(read)],
      create: [hasValidProperties, asyncErrorBoundary(create)],
      update: [validTableCapactiy, validRequest, asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)],
      delete: [tableExists, asyncErrorBoundary(destroy)]
  }