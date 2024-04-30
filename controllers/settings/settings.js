const request = require('../../sqlConection/sqlRequest')

async function get(req, res) {
   if(!req.query?.id) return res.error('El id es requerido')
   var body = {userid: req.user.user_id, business: req.user.business_id, app_id: Number(req.query.id) }
   const sentence = "select settings from app_setting_user where userid = @userid and businessid = @business and appid = @app_id"
   request(0, sentence, body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

async function set(req, res) {
   if(!req.body?.id) return res.error('El id es requerido')
   if(!req.body?.settings) return res.error('La configuración es requerido')
   var body = {userid: req.user.user_id, business: req.user.business_id, app_id: Number(req.body.id), settings: req.body.settings }
   const sentence = "exec setApp_settings @userid, @business, @app_id, @settings"
   request(0, sentence, body).then((result) => {
      res.sendDataTable(result)
   }).catch((err) => {
      res.error(err)
   })
}

module.exports = { get, set }