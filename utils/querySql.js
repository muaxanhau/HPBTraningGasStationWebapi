const sql = require('mssql')
const config = require('./../config')

const querySql = ({ queryString = '' }) =>
  sql.connect(config.databaseInfo).then(pool => {
    return pool
      .query(queryString)
      .then(results =>
        results.recordsets.length === 1
          ? results.recordsets[0]
          : results.recordsets
      )
  })

module.exports = querySql
