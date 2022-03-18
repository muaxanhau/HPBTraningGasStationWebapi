const express = require('express')
const app = express()
const config = require('./config')
app.use(express.json())

const userRouter = require('./routes/users')
app.use('/user', userRouter)

const gasStationRouter = require('./routes/gasStations')
app.use('/gas-station', gasStationRouter)

app.listen(config.serverInfo.port, () => {
  console.log('Server is running')
})
