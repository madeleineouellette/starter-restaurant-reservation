const reservationsService = require("./reservations.service")

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const data = await reservationsService.list()
  res.json({ data });
}

//GET reservations/:reservation_id

async function read(req, res){
  const {reservation_id} = req.params()
  const data = await reservationsService.read(reservation_id)
  res.json({ data })
}

async function create(req, res){
  const reservation = await reservationsService.create(req.body.data)
  res.status(201).json({data: reservation})
}

//GET /reservations?=:date

//PUT /reservations/:reservation_id/status

//GET /reservations?=:mobile_number=:mobilenumber



module.exports = {
  list,
  read,
  create,
};
