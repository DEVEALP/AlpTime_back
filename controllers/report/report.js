const request = require('../../sqlConection/sqlRequest')

async function general(req, res) {
   const sentence = "exec getBiometricReport @start_date, @end_date, @userid, @turnid, @group, @cargo, @departamento, @oficina"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

module.exports = { general }