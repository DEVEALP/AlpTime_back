
const sql = require('mssql');
var ApplicationInstance = require('../ApplicationInstance')

request = (businessid, query, data, getNumberRows) => new Promise((resolve, reject) => {
   getConectionFromBusiness(businessid).then(async (pool) => {
      if (typeof (data) == 'object' && Array.isArray(data)) {
         for (let item of data) {
            await executeQuery(pool, query, item)
         }
         resolve()
      } else {
         executeQuery(pool, query, data).then((data) => {
            if (getNumberRows) resolve(data?.rowsAffected[0])
            else resolve(data?.recordset)
         }).catch((err) => { reject(err) })
      }
   }).catch((result) => {
      reject(result)
   })
})

executeQuery = (pool, query, data) => new Promise((resolve, reject) => {
   let request = pool.request();
   for (let key in data) {
      if (typeof (data[key]) == 'string') request.input(key, sql.NVarChar, data[key]);
      else if (typeof (data[key]) == 'number') request.input(key, sql.Int, data[key]);
      else if (typeof (data[key]) == 'boolean') request.input(key, sql.Bit, data[key].toString() == 'true' ? 1 : 0);
   }
   request.query(query, (err, data) => {
      if (err) reject(err.toString())
      else resolve(data)
   })
})

getConectionFromBusiness = (businessid) => new Promise(async (resolve, reject) => {
   if (businessid == undefined || businessid == null || isNaN(Number(businessid))) return reject('Id de empresa invalido')
   var settings = ApplicationInstance.getConnection(businessid)
   if (!settings) return reject('No se encontro la empresa')
   else settings.options = { encrypt: false, trustServerCertificate: false, requestTimeout: 90000 }
   if (!settings.pool || !settings?.pool?.connected) settings.pool = await new sql.ConnectionPool(settings).connect();
   resolve(settings.pool)
})

module.exports = request
