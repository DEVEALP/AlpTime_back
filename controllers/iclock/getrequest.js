const request = require('../../sqlConection/sqlRequest')

async function getGetRequest(req, res){
   req.query.more = 0
   if(req.query?.INFO) req.query.more = 1
   request(req.businessid, ` exec getbiometric_processes 'device', 0, @SN `, req.query).then((result)=>{
      var response = 'ok'
      if(result.length > 0) response = 'C:' + result[0].id + ':' + result[0].command
      res.send(response)
   }).catch((message)=>{
      res.error(message, 400)
   })
}  
 
async function postGetRequest(req, res){
   res.send("ok")
}

module.exports = { getGetRequest, postGetRequest };