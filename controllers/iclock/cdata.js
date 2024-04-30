const request = require('../../sqlConection/sqlRequest')
const tools = require('../../tools/tools')

async function getCdata(req, res) {
   if (req.query.options == 'all') {
      request(req.businessid, 'select timezone from biometric_devices where SN = @SN', req.query).then((response) => {
         if (response.length > 0) res.send(`GET OPTION FROM: ${req.query.SN}\rTimeZone=${response[0].timezone}\rStamp=0\rOpStamp=0\rPhotoStamp=0\rErrorDelay=60\rDelay=${response[0].timeDelay}\rServerVer=2.4.1\rPushProtVer=2.4.1\rEncryptFlag=1000000000\rPushOptionsFlag=1\rSupportPing=1\rPushOptions=UserCount,TransactionCount,FingerFunOn,FPVersion,FPCount,FaceFunOn,FaceVersion,FaceCount,FvFunOn,FvVersion,FvCount,PvFunOn,PvVersion,PvCount,BioPhotoFun,BioDataFun,PhotoFunOn,~LockFunOn\rTransTimes=00:00;14:05\rTransInterval=3\rTransFlag=TransData AttLog      OpLog   AttPhoto        EnrollFP        EnrollUser      FPImag  ChgUser ChgFP   FACE    UserPic FVEIBioPhoto\rRealtime=1\rEncrypt=0`)
         else res.error('No se encontro el biometrico', 400)
      }).catch((message) => {
         res.error(message, 400)
      })
   } else {
      res.send("ok")
   }
}

async function postCdata(req, res) {
   if (req.query.table == 'ATTLOG') {
      var sentence = `exec setBiometric_records 'add', @userid, @datetime,  @type, @sensor_id, 0, @devicecode, '', 0`
      var lines = req.body?.trim()?.split('\n')
      var datos = []
      for (let line of lines) {
         var items = line.split('\t')
         if (items.length >= 10) {
            var record = { userid: Number(items[0]), datetime: items[1], type: Number(items[2]), sensor_id: Number(items[3]), devicecode: req.query.SN }
            datos.push(record)
         }
      }
      await request(req.businessid, sentence, datos).catch((message) => { console.log(message) })
   } else if (req.query.table == 'OPERLOG') {
      req.body = req.body.replace('Body: ', '').trim()
      var lines = req.body?.trim()?.split('\n')
      var sentence = ''
      var datos = []
      for (let line of lines) {
         if (line.includes('USER')) {
            sentence = `exec setBiometric_user 'add', 'device', 0, @deviceid, @PIN, @Name, '', @Pri,  @Passwd,  @Card, ''`
            line = line.replace('USER', '').trim()
            var user = tools.getObjectFromString(line, '\t')
            user.deviceid = req.deviceid
            datos.push(user)
         } else if (line.includes('BIOPHOTO')) {
            sentence = `exec setBiometric_images 'add', @deviceid, @PIN, @picture, @Content`
            line = line.replace('BIOPHOTO', '').trim()
            var photo = tools.getObjectFromString(line, '\t')
            photo.deviceid = req.deviceid
            photo.picture = await tools.resizeImageBase64(photo.Content, 50, 50).then((r) => { return r }).catch((message) => {
               tools.printTextColorRed('----------     Error al convertir imagen    -----------')
               tools.printTextColorRed('ERROR: ' + message)
               tools.printTextColorRed('VALOR: ' + JSON.stringify(user))
               return ''
            })
            datos.push(photo)
         } else if (line.includes('FP')) {
            sentence = `setbiometric_fingerprint 'device', 'add', @deviceid, @PIN, @FID, @TMP`
            line = line.replace('FP', '').trim()
            var fp = tools.getObjectFromString(line, '\t')
            fp.deviceid = req.deviceid
            datos.push(fp)
         }
      }
      await request(req.businessid, sentence, datos).then((response) => {  }).catch((response) => {  })
   }
   res.send("ok")
}

saveItem = (sentence, type,) => new Promise((resolve) => {

})

module.exports = { getCdata, postCdata };