const getRawBody = require('raw-body');
const request = require('../sqlConection/sqlRequest')
var devices = require('../ApplicationInstance').devices

async function parse (req, res, next) {
    
    if(!req.query.SN){
        console.log("Codigo del dispositivo invalido")
        return res.error("Codigo del dispositivo invalido", 400)
    } 

    var ipAddress = req.ip || req.connection.remoteAddress;
    req.ip = ipAddress.replace('::ffff:', '')
    
    await request(0, ' select businessid from biometric_devices where sn = @sn ', {sn: req.query.SN}).then((result)=>{
        if(result?.length > 0){
            req.businessid = result[0].businessid
            if (req.headers['content-type'] === 'application/octet-stream') {
                // console.log(req)
                next();
                // getRawBody(req, {
                //     length: req.headers['content-length'],
                //     encoding: req.charset
                // }, function (err, string) {
                //     if(err){
                //         console.log("Cuerpo de la peticion invalido")
                //         return res.error("Cuerpo de la peticion invalido", 400)
                //     }
                //     req.body = string.toString();
                //     console.log('Body: ' + JSON.stringify(req.body))
                //     next();
                // })
            }else if(req.headers['content-type'] === 'text/plain'){
                console.log('Body: ' + req.body)
                next();
            }else {
                if(req.method == 'POST') console.log(req.headers['content-type'])
                next();
            }
        }else{
            var device = devices.find((d)=> d.sn == req.query.SN ) 
            if(device){
                device.last_communication = new Date()
                return res.status(200).send("UNKNOWN Device")
            }else{
                devices.push({sn: req.query.SN, last_communication: new Date(), ip: req.ip })
                return res.error("Not Authorized", 400) 
            }
        }
    }).catch((message)=>{
        return res.error(message, 400)
    })
}

module.exports = parse;
