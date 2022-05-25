const service = require("./tables.service")
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


const VALID_PROPERTIES = [
  "table_name",
  "capacity"
]


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

function hasRequiredProperties(req, res, next){
  if(hasProperties(VALID_PROPERTIES, req.body)){
    return next()
  }
  return next({
    status: 400,
    message: `Table needs field`
  })
}

async function tableExists(req, res, next){
  const { table_id } = req.params
  const table = await service.read(table_id)
  if(table){
    return next()
  } 
  return next({ status: 404, message: `Table cannot be found.` });
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
   const table = await service.create(req.body)
   res.status(201).json({data: table})
 }

 async function update(req, res) {
  const {table_id} = req.params
  const data = await service.update(table_id, req.body)
  res.json({ data });
}

async function destroy(req, res) {
  const { table_id } = req.params
  await service.destroy(table_id)
  res.sendStatus(204)
}

  module.exports = {
      list,
      read: [tableExists, asyncErrorBoundary(read)],
      create: [hasValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
      update: [tableExists, hasValidProperties, asyncErrorBoundary(update)],
      delete: [tableExists, asyncErrorBoundary(destroy)]
  }