const sql = require('mssql')
const config = require('./../config')

const querySql = ({ queryString = '', onSuccess, onError }) => {
  sql.connect(config.databaseInfo, err => {
    if (err) {
      onError?.()
    } else {
      const request = new sql.Request()

      request.query(queryString, (err, recordset) => {
        if (err) {
          onError?.()
        } else {
          const data = recordset.recordset

          onSuccess?.(data)
        }
      })
    }
  })
}

module.exports = querySql
