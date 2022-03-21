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
      let data1 = [...data[0]].map(item => ({ ...item, GasTypes: '' }))
      let data2 = [...data[1]]

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
                            GasStation.Rating,
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

  const queryString3 = `select * from GasStationFeedback where GasStationId = ${id}`

  const queryString = `${queryString1};${queryString2};${queryString3}`
  querySql({ queryString }).then(data => {
    let data1 = { ...data[0][0], GasTypes: '', Feedback: [] }
    let data2 = [...data[1]]
    let data3 = [...data[2]]

    data2.forEach(item => {
      const tmp = data1.GasTypes
      data1.GasTypes += (tmp !== '' ? ', ' : '') + item.TypeText
    })

    data3.forEach(item => {
      const tmp = { Content: item.Feedback, Time: item.FeedbackAt }
      data1.Feedback.push(tmp)
    })

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
    idUser,
    gasTypes
  } = req.body

  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`

  const queryString1 = `insert into GasStation (GasStationName, Address, District, OpeningTime, Longitude, Latitude, Rating, InsertedAt, InsertedBy, UpdatedAt, UpdatedBy)
                        values ('${name}', '${address}', ${district}, '${openingTime}', ${longitude}, ${latitude}, '${rating}', '${dateString}', ${idUser}, '${dateString}', ${idUser});`

  let queryString2 = ''
  gasTypes.forEach(item => {
    queryString2 += `insert into GasStationGasType
                    values ((select max(GasStationId) from GasStation), '${item}');`
  })

  const queryString = `${queryString1};${queryString2}`

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
    idUser,
    gasTypes
  } = req.body

  if (!id) {
    res.sendStatus(400)
    return
  }

  const date = new Date()
  const dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`
  const queryString1 = `update GasStation set GasStationName='${name}', Address='${address}', District='${district}', OpeningTime='${openingTime}', 
                        Longitude='${longitude}', Latitude='${latitude}', Rating='${rating}', UpdatedAt='${dateString}', UpdatedBy='${idUser}'
                        where GasStationId = ${id}`

  const queryString2 = `delete from GasStationGasType where GasStationId = ${id};`

  let queryString3 = ''
  gasTypes.forEach(item => {
    queryString3 += `insert into GasStationGasType
                    values (${id}, '${item}');`
  })

  const queryString = `${queryString1};${queryString2};${queryString3}`

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

  const queryString = `delete from GasStationGasType where GasStationId = ${id}; delete from GasStation where GasStationId = ${id}`

  querySql({ queryString })
    .then(data => res.sendStatus(200))
    .catch(e => res.sendStatus(500))
})

router.get('/search', (req, res) => {
  const { name, gasTypes, districtId } = req.query

  const gasTypesArray = gasTypes ? gasTypes.split(' ') : []
  const gasTypesString = `'${gasTypesArray.toString().replace(',', `','`)}'`

  if (gasTypesArray.length === 0) {
    const queryString1 = `select taba.GasStationId, taba.GasStationName, tabc.DistrictName, taba.Longitude, taba.Latitude, taba.Rating from GasStation as taba inner join
                          (select distinct GasStationId from GasStationGasType 
                        where 
                          GasStationId in (select GasStationId from GasStation where 1 = 1${
                            districtId ? ` and District = ${districtId}` : ''
                          }${name ? ` and GasStationName = '${name}'` : ''}))
                          as tabb on taba.GasStationId = tabb.GasStationId inner join M_District as tabc on taba.District = tabc.DistrictId`

    const queryString2 = `select GasStationGasType.GasStationId, GasType.TypeText from GasStationGasType inner join GasType on GasStationGasType.GasType = GasType.TypeCode`

    const queryString = `${queryString1};${queryString2}`

    querySql({ queryString })
      .then(data => {
        let data1 = [...data[0]].map(item => ({ ...item, GasTypes: '' }))
        let data2 = [...data[1]]

        data1 = data1.map(item => ({
          ...item,
          GasTypes: data2
            .filter(tmp => item.GasStationId === tmp.GasStationId)
            .map((item, index) => item.TypeText)
            .toString()
        }))

        res.json(data1)
      })
      .catch(e => res.sendStatus(500))

    return
  }

  const queryString1 = `select taba.GasStationId, taba.GasStationName , tabc.DistrictName, taba.Longitude, taba.Latitude, taba.Rating from GasStation as taba inner join (select 
                  count(GasStationId) as counter, GasStationId from GasStationGasType 
                where 
                  GasStationId in (select GasStationId from GasStation where 1 = 1${
                    districtId ? ` and District = ${districtId}` : ''
                  }${name ? ` and GasStationName = '${name}'` : ''})
                  and GasType in (${gasTypesString})
                group by GasStationId having count(*) = ${
                  gasTypesArray.length
                }) as tabb on taba.GasStationId = tabb.GasStationId inner join M_District as tabc on taba.District = tabc.DistrictId`

  const queryString2 = `select GasStationGasType.GasStationId, GasType.TypeText from GasStationGasType inner join GasType on GasStationGasType.GasType = GasType.TypeCode`

  const queryString = `${queryString1};${queryString2}`

  querySql({ queryString })
    .then(data => {
      let data1 = [...data[0]].map(item => ({ ...item, GasTypes: '' }))
      let data2 = [...data[1]]

      data1 = data1.map(item => ({
        ...item,
        GasTypes: data2
          .filter(tmp => item.GasStationId === tmp.GasStationId)
          .map((item, index) => item.TypeText)
          .toString()
      }))

      res.json(data1)
    })
    .catch(e => res.sendStatus(500))
})

module.exports = router
