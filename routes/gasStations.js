const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.get('/', (req, res) => {
  const { id } = req.query

  if (!id) {
    const queryString1 = `select 
                            GasStation.GasStationId,
                            GasStation.GasStationName, 
                            M_District.DistrictName,
                            GasStation.Longitude, 
                            GasStation.Latitude, 
                            GasStation.Rating
                        from 
                            GasStation inner join M_District on GasStation.District = M_District.DistrictId`

    const queryString2 = `select 
                            GasStationGasType.GasStationId, GasType.TypeText
                        from 
                            GasStationGasType inner join GasType on GasStationGasType.GasType = GasType.TypeCode`

    const queryString = `${queryString1};${queryString2}`
    querySql({ queryString }).then(data => {
      let data1 = [...data[0]]
      let data2 = [...data[1]]

      data1 = data1.map(item => ({ ...item, GasTypes: '' }))

      data2.forEach(item => {
        const tmp = data1.find(
          gasStation => gasStation.GasStationId === item.GasStationId
        ).GasTypes

        data1.find(
          gasStation => gasStation.GasStationId === item.GasStationId
        ).GasTypes += (tmp !== '' ? ', ' : '') + item.TypeText
      })

      res.json(data1)
    })

    return
  }

  const queryString1 = `select
                            GasStation.GasStationName, 
                            M_District.DistrictName,
                            GasStation.Address,
                            GasStation.OpeningTime,
                            GasStation.Rating
                        from 
                            GasStation inner join M_District on GasStation.District = M_District.DistrictId
                        where 
                            GasStation.GasStationId = ${id}`

  const queryString2 = `select 
                            GasType.TypeText
                        from 
                            GasStationGasType inner join GasType on GasStationGasType.GasType = GasType.TypeCode
                        where
                            GasStationGasType.GasStationId = ${id}`

  const queryString = `${queryString1};${queryString2}`
  querySql({ queryString }).then(data => {
    let data1 = { ...data[0][0], GasTypes: '' }
    let data2 = [...data[1]]

    data2.forEach(item => {
      const tmp = data1.GasTypes
      data1.GasTypes += (tmp !== '' ? ', ' : '') + item.TypeText
    })

    console.log(data1)
    console.log(data2)
    res.json(data1)
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
  const queryString = `insert into GasStation (GasStationName, Address, District, OpeningTime, Longitude, Latitude, Rating, InsertedAt, InsertedBy, UpdatedAt, UpdatedBy)
                        values ('${name}', '${address}', ${district}, '${openingTime}', ${longitude}, ${latitude}, '${rating}', '${dateString}', ${idUser}, '${dateString}', ${idUser});`

  querySql({ queryString })
    .then(data => res.sendStatus(201))
    .catch(e => res.sendStatus(400))
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
    return
  }

  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`
  const queryString = `update GasStation set GasStationName='${name}', Address='${address}', District='${district}', OpeningTime='${openingTime}', 
                        Longitude='${longitude}', Latitude='${latitude}', Rating='${rating}', UpdatedAt='${dateString}', UpdatedBy='${idUser}'
                        where GasStationId=${id}`

  querySql({ queryString })
    .then(data => res.sendStatus(204))
    .catch(e => res.sendStatus(500))
})

router.delete('/', (req, res) => {
  const { id } = req.query

  if (!id) {
    res.sendStatus(400)
    return
  }

  const queryString = `delete from GasStation where GasStationId=${id}`

  querySql({ queryString })
    .then(data => res.sendStatus(200))
    .catch(e => res.sendStatus(500))
})

module.exports = router
