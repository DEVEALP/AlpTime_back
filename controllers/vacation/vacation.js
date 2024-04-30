const request = require('../../sqlConection/sqlRequest')

async function get(req, res) {
   const sentence = "exec getBiometric_vacation @start, @end, @group, @periodo, @userid, @office, @departament, @cargo"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function holidays(req, res) {
   const sentence = "select nombre, convert(varchar(10), min(fecha), 23) date_start, convert(varchar(10), max(fecha), 23) as date_end, year(fecha) as anio from biometric_holidays where year(fecha) between year(getdate()) and (year(getdate()) + 1) group by nombre, year(fecha) order by min(fecha) asc"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function asing(req, res) {
   req.body.username = req.user.nameuser
   const sentence = "exec setBiometric_vacation @action, @username, @period, @userid, @start, @end "
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendResponseStatus(result)
   }).catch((err) => {
      res.error(err)
   })
} 

module.exports = { holidays, asing, get }