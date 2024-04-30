const request = require('../../sqlConection/sqlRequest')

async function get(req, res) {
   const sentence = "exec getBiometric_turns @value"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getCalendar(req, res) {
   const sentence = "exec getBiometric_dataCalendar @action, @year, @month, @day, @group, @turnid, @userid, @office, @departament, @cargo"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function users(req, res) {
   console.log(req.body)
   const sentence = "exec biometricUsersTurns @value, @office, @departament, @job, @turn, @group"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function asing(req, res) {
   const sentence_insert  = 'insert into biometric_user_turns_temporary (userid, code) values (@userid, @code)'
   const sentence = 'exec setBiometric_user_turns @action, @nameuser, @turnid, @userid, @key, @start, @end, @days'  
   req.body.nameuser = req.user.nameuser
   console.log(req.body)
   if(req.body.users.length > 1) for(let x of req.body.users) await request(req.user.business_id, sentence_insert, {userid: x, code: req.body.key.toString()}).then((result) => {  }).catch((err) => { })
   request(req.user.business_id, sentence, req.body).then((result) => {
      console.log(result)
      res.sendDataTable(result)
   }).catch((err) => { res.error(err) })
} 

module.exports = { get, getCalendar, asing, users }