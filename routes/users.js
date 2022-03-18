const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.post('/', (req, res) => {
  const { email, password } = req.body

  const queryString = `select * from "User" where Email='${email}' and Password='${password}'`

  querySql({ queryString })
    .then(data => {
      data.length && res.json({ id: data[0].UserId })
      !data.length && res.sendStatus(401)
    })
    .catch(e => res.sendStatus(500))
})

module.exports = router
