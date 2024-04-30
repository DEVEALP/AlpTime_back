var request = require("../sqlConection/sqlRequest");
const ApplicationInstance = require('../ApplicationInstance');
const jwt = require('jsonwebtoken');

async function login(req, res){
   var tokenTime = 30; 
   var config = ApplicationInstance.getBusiness(0); 
   var business = ApplicationInstance.getBusiness(req.body.business); 
   if(business == undefined && req.body.business > 0) return res.error('La empresa seleccionada no tiene una licencia vigente en el servidor');
   if(business?.tokenTime != null) tokenTime = business.tokenTime;
   const sentence = "exec auth @time, @username, @password, @business, @device_code, @ip, @system, @navigator, @country, @city";
   const apps = "select a.id, a.name, a.image as icon_app, a.path as route_path, iif(s.settings is not null, s.settings, a.settings) as settings from app_permission p (nolock) 	inner join apps a (nolock) on a.id = p.appid  left join app_setting_user s (nolock) on s.appid = p.appid and s.businessid = p.businessid and s.userid = p.userid where p.userid = @userid and p.businessid = @businessid";
   try{
      var body = {
         time: tokenTime,
         username: req.body.username,
         password: req.body.password,
         business: req.body.business,
         device_code: req.body.device.code,
         ip: req.ip,
         system: req.body.device.system,
         navigator: req.body.device.navigator,
         country: '',
         city: ''
      }
      request(0, sentence, body).then((result)=>{
         if(!result || result.length == 0) return res.error('El servidor no respondio correctamente. Cod:500')
         if(result[0].code != 200 && result[0].code != 202) return res.error(result[0].message)

         if(result[0].code == 200){
            var id_business = result[0].id_business
            var id_user = result[0].id
            if(body.business == 0) business = ApplicationInstance.getBusiness(id_business)

            request(0, apps, {userid: id_user, businessid: id_business}).then((business)=>{
               var name_user = result[0].nameuser
               var rol = result[0].rol
               var id_session = result[0].id_session
               var payload = { nameuser: name_user, user_id: id_user, rol: rol, business_id: id_business, session_id: id_session, time: tokenTime };
               const token = jwt.sign(payload, config.tokenKey, {expiresIn: tokenTime+'m'});
               res.setHeader('time_token', (new Date().getTime() + (60000 * tokenTime)));
               res.setHeader('token', token);
               res.send({datatable1: result, datatable2: business})
            }).catch((err)=>{
               res.error('Error al cargar las aplicaciones')
            }) 
         }else{
            res.send({datatable1: result, datatable2: result})
         }
      }).catch((err)=>{
         console.log('err', err)
         return res.error(err + '')
      })
   }catch(err){
      return res.error('Error al procesar la solicitud')
   }
}


 
module.exports = { login };