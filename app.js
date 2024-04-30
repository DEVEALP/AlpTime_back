var ApplicationInstance = require('./ApplicationInstance')
const server = require('./httpSystem/server')
const router = require('./router')
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws'); 

const port = 8431
const license = './sqlConection/database.json'

const app = server()
app.use(router)
app.cors()
app.enableViewAllRequest()

if (!fs.existsSync(license)) throw 'No existe Licencia'
fs.readFile(license, async (err, data) => {
  if (err) throw "Los datos del JSON no se obtuvieron"
  try {
    var settings = JSON.parse(data.toString())
    createServer(settings)
  } catch {
    throw "Archivo de configuracion no valido "
  }
})

function createServer(data){
  ApplicationInstance.setData(data)
  app.listen(port, '0.0.0.0', ()=> console.log(`Servidor iniciado en el puerto: ${port}`) )
}