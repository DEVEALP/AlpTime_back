const request = require('../../sqlConection/sqlRequest')

async function get(req, res) {
   const sentence = "exec getBiometric_permission @start, @end, @group, @motive, @userid, @office, @departament, @cargo"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function getMotives(req, res) {
   const sentence = "select * from biometric_permission_motives"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 


async function asing(req, res) {
   req.body.username = req.user.nameuser
   const sentence = "exec setBiometric_permission @action, @username, @motive, @details, @userid, @start, @end, @time "
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendResponseStatus(result)
   }).catch((err) => {
      res.error(err)
   })
} 

module.exports = { asing, get, getMotives }