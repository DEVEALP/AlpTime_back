const request = require('../../sqlConection/sqlRequest')
const table = require("@el3um4s/node-mdb");

async function get(req, res) {
   const sentence = "exec getbiometric_devices @device_id, '', @value"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function options(req, res) {
   if (!req.body?.device_id) return res.error('No se encontró datos del dispositivo')
   if(!req.body?.action) return res.error('No se encuentra la acción')
   req.body.nameuser = req.user.nameuser
const sentence = "EXEC setBiometric_device @action, @nameuser,@device_id,@name, @sn, @ip, @port, @allow, 0, 0, 0, 0, @timezone, 0, @language, 0, '', '', '', '', '', '', @ubication, '', @volume"
request(req.user.business_id, sentence, req.body).then((result) => {
   res.sendDataTable(result)
}).catch((err) => {
   res.error(err)
})
}

async function getProcess(req, res) {
   const sentence = "exec getbiometric_processes 'user', @device_id, @value"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function processOptions(req, res) {
   req.body.username = req.user.nameuser
   const sentence = "exec setbiometric_processes 'user', @action, @id, @value, @username"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
} 

async function records(req, res) {
   if (!req.body?.device_id) return res.error('No se encontró datos del dispositivo')
   const sentence = "exec getbiometric_data @device_id, @start_date, @end_date, @turnid, @userid, @office, @departament, @cargo, @group"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function clear(req, res) {
   if (!req.body?.device_id) return res.error('No se encontró datos del dispositivo')
   const sentence = "exec biometric_records @device_id, @value, @group, @start_date, @end_date, @property, @order"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function recordOptions(req, res) {
   req.body.username = req.user.nameuser
   const sentence = "exec setBiometric_records @action, @userid, @datetime, 0, 0, @deviceid, '', @username, @id"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getGroups(req, res) {
   const sentence = "exec getGroups @value"
   request(req.user.business_id, sentence, { value: req.query?.value }).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getUsers(req, res) {
   const sentence = "exec getBiometric_user @type, @top, @deviceid, @search  "
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function usersOptions(req, res) {
   const sentence = "exec setBiometric_user 'user', @mode, @deviceid, @id, @name, @cedula, 0, 0, 0, @grupo"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getImageUsers(req, res) {
   if (!req.body.deviceid || !req.body.userid) return res.error('No se encontró datos del usuario')
   const sentence = "select date_create, imagen from biometric_images where device_id = @deviceid and userid = @userid "
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getOptions(req, res) {
   const sentence = "exec getOptions"
   request(req.user.business_id, sentence).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function getCalendar(req, res) {
   const sentence = "exec getCalendar"
   request(req.user.business_id, sentence).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function report_old(req, res) {
   const sentence = "execute sp_getAttendanceReport @start_date, @end_date"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function report_old2(req, res) {
   const sentence = " exec biometric_General_report @start_date, @end_date, 8, @deviceId"
   request(req.user.business_id, sentence, req.body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function recordsAsync(req, res) {
   if (req.body?.start_date == '' || req.body?.end_date == '') return res.error('Las fechas son requeridas')
   if (req.body?.device_id == '' || req.body?.device_id == undefined) return res.error('El dispositivo es requerido')
   var sentence_records = ` select r.userid, r.checktime, r.checktype, coalesce(f.nombre, '') as fileName from biometric_data r (nolock) inner join biometric_devices d (nolock) on d.id = r.device_id left join ALPTABLA as f (nolock) on f.master = 'J09' AND f.codigo = d.id where userid != 1 and cast(checktime as date) between @start_date and @end_date `
   var sentence_users = ` select r.userid, r.name, r.id, coalesce(f.nombre, '') as fineName from biometric_users as r (nolock) inner join biometric_devices d on d.id = r.device_id left join ALPTABLA f on f.master = 'J09' AND F.codigo = d.id where r.synchronized = 0`
   var counts_records = 0
   var counts_users = 0
   var records = await request(req.user.business_id, sentence_records, req.body).then((result) => result).catch((err) => [])
   var users = await request(req.user.business_id, sentence_users).then((result) => result).catch((err) => [])
   for (let x of records) {
      var date = x.checktime?.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
      var query = `insert into [CHECKINOUT] (USERID, CHECKTIME, CHECKTYPE) VALUES ('${x.userid}', '${date}', '${x.checktype}')`
      await table.query.sql({ database: x.fileName, sql: query })
      counts_records++;
   }
   for (let x of users) {
      var query = `insert into [USERINFO] (USERID, Badgenumber, NAME) VALUES (${x.userid}, '${x.userid}', '${x.name}')`
      await table.query.sql({ database: x.fileName, sql: query }).then(async () => {
         await sqlAction(config.business, `update biometric_users set synchronized = 1 where id = ${x.id}`);
         counts_users++;
      }).catch((err) => {
         console.log(err)
      })
   }
   res.sendDataTable({ totalUsers: users.length, uploadUsers: counts_users, totalRecords: records.length, uploadRecords: counts_records })
}

module.exports = { get, options, getProcess, processOptions, clear, records, getGroups, getOptions, getCalendar, getUsers, usersOptions, getImageUsers, recordsAsync, report_old, report_old2, recordOptions  }