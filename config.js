const serverInfo = {
  port: 3170
}

const databaseInfo = {
  server: '192.168.1.1',
  user: 'sa',
  password: 'Hpbvn123',
  database: 'GasStation_Thinh',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

const config = {
  serverInfo,
  databaseInfo
}

module.exports = config
