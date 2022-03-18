const express = require('express')
const router = express.Router()
const querySql = require('./../utils/querySql')

router.post('/', (req, res) => {
  const { email, password } = req.body

  querySql({
    queryString: `select * from "User" where Email='${email}' and Password='${password}'`,
    onSuccess: data => {
      data.length && res.json({ id: data[0].UserId })
      !data.length && res.sendStatus(401)
    },
    onError: () => {
      res.sendStatus(500)
    }
  })
})

module.exports = router
