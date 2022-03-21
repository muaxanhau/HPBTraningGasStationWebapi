const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.get('/gas-type', (req, res) => {
  const queryString = `select TypeCode, TypeText from GasType`

  querySql({ queryString })
    .then(data => {
      res.json(data)
    })
    .catch(e => res.sendStatus(500))
})

router.get('/district', (req, res) => {
  const queryString = `select * from M_District`

  querySql({ queryString })
    .then(data => {
      res.json(data)
    })
    .catch(e => res.sendStatus(500))
})

module.exports = router
