const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.get('/gas-type', (req, res) => {
  const queryString = `select * from "User"`

  querySql({ queryString })
    .then(data => {
      res.json({ data: null })
    })
    .catch(e => res.sendStatus(500))
})

module.exports = router
