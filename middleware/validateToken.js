 const ApplicationInstance = require('../ApplicationInstance')
const jwt = require('jsonwebtoken');

 const validateToken = (req, res, next) => {
  var token = req.headers['token'];
  var data = ApplicationInstance.getBusiness(0)
  if(token && token.length > 50){
   jwt.verify(token, data?.tokenKey, (err, decoded) => {
      if (!err) {
         var time_left = Number(((decoded.exp - Number((new Date().getTime() / 1000).toFixed(0))) / 60).toFixed(0));
         var payload = decoded
         delete payload.iat;
         delete payload.exp;
         if(time_left < Calcular33PorCiento(decoded.time)){
            const token = jwt.sign(payload, data.tokenKey, {expiresIn: decoded.time+'m'});
            res.setHeader('time_token', (new Date().getTime() + (60000 * decoded.time)));
            res.setHeader('token', token);
         }
         req.user = payload;
         next();
      }else{
         res.error('No autorizado', 401);
      }
   })
  }else{
      res.error('No autorizado', 401);
  }

};

function Calcular33PorCiento(valor){
    var porcentaje = 0;
    if (valor <= 0) return porcentaje;

    porcentaje = Number((valor * 0.33).toFixed(0));
    return porcentaje;
}
 
 module.exports = validateToken;