const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.get('/', (req, res) => {
  const { id } = req.query

  querySql({
    queryString: `select * from GasStation ${id && `where GasStationId=${id}`}`,
    onSuccess: data => {
      res.json(data)
    },
    onError: () => {
      res.sendStatus(500)
    }
  })
})

router.post('/', (req, res) => {
  const {
    name,
    address,
    district,
    openingTime,
    longitude,
    latitude,
    rating,
    idUser
  } = req.body

  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`

  querySql({
    queryString: `insert into GasStation (GasStationName, Address, District, OpeningTime, Longitude, Latitude, Rating, InsertedAt, InsertedBy, UpdatedAt, UpdatedBy)
    values ('${name}', '${address}', ${district}, '${openingTime}', ${longitude}, ${latitude}, '${rating}', '${dateString}', ${idUser}, '${dateString}', ${idUser});`,

    onSuccess: data => {
      res.sendStatus(201)
    },
    onError: () => {
      res.sendStatus(400)
    }
  })
})

router.put('/', (req, res) => {
  const { id } = req.query
  const {
    name,
    address,
    district,
    openingTime,
    longitude,
    latitude,
    rating,
    idUser
  } = req.body

  if (!id) {
    res.sendStatus(400)
  } else {
    const date = new Date()
    const dateString = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`

    querySql({
      queryString: `update GasStation set GasStationName='${name}', Address='${address}', District='${district}', OpeningTime='${openingTime}', 
      Longitude='${longitude}', Latitude='${latitude}', Rating='${rating}', UpdatedAt='${dateString}', UpdatedBy='${idUser}'
        where GasStationId=${id}`,
      onSuccess: data => {
        res.sendStatus(204)
      },
      onError: () => {
        res.sendStatus(500)
      }
    })
  }
})

router.delete('/', (req, res) => {
  const { id } = req.query

  if (!id) {
    res.sendStatus(400)
  } else {
    querySql({
      queryString: `delete from GasStation where GasStationId=${id}`,
      onSuccess: data => {
        res.sendStatus(200)
      },
      onError: () => {
        res.sendStatus(500)
      }
    })
  }
})

module.exports = router
