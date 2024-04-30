var tools = require('../../tools/tools')
const request = require('../../sqlConection/sqlRequest')

async function getDevicecmd(req, res) {
   console.log('Response: ok')
   res.send("ok")
}

async function postDevicecmd(req, res) {
   var lines = req.body.toString().split('\n')
   var options = tools.getObjectFromString(lines[0].replace('body: ', ''), '&')
   if (options.CMD == 'INFO') {
      req.body = req.body.split('~').join('').replace(lines[0], '')
      var data = tools.getObjectFromString(req.body.replace(lines[0], '').trim(), '\n')
      data.Id = options.ID
      var body = { action: 'device', nameuser: req.query.SN, device_id: 0, name: '', sn: req.query.SN, ip: data?.IPAddress ?? '', 
         port: 0, allow: 0, users_counts: data?.UserCount ?? 0, logs_counts: data?.TransactionCount ?? 0, fingerprint_counts: data?.FPCount ?? 0, 
         face_counts: data?.FaceCount ?? 0, timezone: '', maxusers: 0, language: data?.Language ?? '', maxlogs: 0, mac: data?.MAC ?? '', model: data?.DeviceName ?? '', 
         serial: data?.SerialNumber ?? '', mark: data?.OEMVendor ?? '', pushversion: data?.PushVersion ?? '', fwversion: data?.FWVersion ?? '', ubication: '', version: '', volume: data?.VOLUME ?? 0
      }
      await request(req.businessid, 'exec setBiometric_device @action, @nameuser, @device_id, @name, @sn, @ip, @port, @allow, @users_counts, @logs_counts, @fingerprint_counts, @face_counts, @timezone, @maxusers, @language, @maxlogs, @mac, @model, @serial, @mark, @pushversion, @fwversion, @ubication, @version, @volume', body).catch((err)=>{
         console.log('ERROR SQL: ' + err)
      })
   }
   await request(req.businessid, `exec setbiometric_processes 'device', 'complete', @Id, ''`, options).then((result)=>{
      if(result.length > 0 && result[0].code == 200){
         res.send("ok")
      }else {
         res.error(result[0].message, 400)
      }
   }).catch((message)=>{
      console.log('SQL ERROR: ' + message)
      res.error(message, 400)
   })
}



module.exports = { getDevicecmd, postDevicecmd };