const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

var instance;
var server_options;
var server_requests
var useCors = false
var viewAllRequest = false
var data = []

function server() {
   if (!instance) {
      server_requests = async (req, res) => {
         res.setHeader('Access-Control-Expose-Headers', 'time_token, token');
         if (useCors) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
            res.setHeader('Access-Control-Allow-Headers', '*');
         }
         if (req.method === 'OPTIONS') return res.writeHead(200).end();
         if(viewAllRequest) console.log(req.method, ':', req.url)
         res.send = (value) => send(res, value)
         res.sendDataTable = (datatable1, datatable2) => sendDataTable(res, datatable1, datatable2)
         res.sendResponseStatus = (value) => sendResponseStatus(res, value)
         res.error = (message, code) => error(res, message, code)
         req.body = await getBody(req)
         req.ip = req.connection.remoteAddress.replace('::ffff:', '')
         const parsedUrl = url.parse(req.url, true);
         req.query = parsedUrl.query

         var router = data.find((r) => r.type == 'router' && parsedUrl.pathname.includes(r.path))
         var middlewares = data.find((r) => r.type == 'middleware' && parsedUrl.pathname.includes(r.path))?.middlewares ?? []
         var end = (route)=>{
            if (route) {
               var index = 0
               var next = ()=>{
                   index++; 
                   if(index < middlewares.length) middlewares[index](req, res, next)
                   else route.request(req, res)
                }
               if(middlewares.length > 0) middlewares[index](req, res, next)
               else route.request(req, res)
            }else{
               res.statusCode = 404
               res.end()
            }
         }

         var myRequest
         if(router) myRequest = router.subroutes.find((r) => r.type == 'route' && router.path + '/' + r.path == parsedUrl.pathname && r.method.toLowerCase() == req.method?.toLowerCase())
         if(!myRequest) myRequest = data.find((r) => r.type == 'route' && parsedUrl.pathname == r.path && r.method == req.method)
         end(myRequest)
      }
   }
   return { use: use, listen: listen, router: setRoutes, cors: cors, enableViewAllRequest:enableViewAllRequest, useSsl: useSsl}
}

resolve_middleware = (validation) => new Promise((resolve) => {
   
})

function setRoutes() {
   var values = []
   return {
      values: values,
      post: (path, request) => {
         if(request) values.push({ path: path, request: request, method: 'POST', type: 'route' })
      },
      get: (path, request) => {
         if(request)  values.push({ path: path, request: request, method: 'GET', type: 'route' })
      },
      router: (path, routes) => {
         if(routes) data.push({ path: path, type: 'router', subroutes: routes.values })
      },
      middleware: (path, validator) => {
         var index = values.findIndex((e) => e.path == path && e.type == 'middleware')
         if (index == -1) {
            values.push({ path: path, type: 'middleware', middlewares: [] })
            index = values.length - 1
         }
         values[index].middlewares.push(validator)
      }
   }
}

getBody = (req) => new Promise((resolve) => {
   if (req.method == "POST") {
      let body = [];
      req.on('error', (err) => {
         console.error(err);
      }).on('data', (chunk) => {
         body.push(chunk);
      }).on('end', () => {
         var data = Buffer.concat(body).toString()
         try { resolve(JSON.parse(data)); }
         catch { resolve(data); }
      });
   } else {
      resolve()
   }
})

function enableViewAllRequest() { viewAllRequest = true }

function use_router(path, execute) {
   if (execute == router) console.log(execute)
   else settings.middleware.push({ path: path, request: execute })
   console.log(settings)
}

function send(res, value) {
   if (typeof (value) == 'string') res.setHeader('Content-Type', 'text/plain');
   if (typeof (value) == 'object') value = JSON.stringify(value)
   res.write(value)
   res.end();
}

function sendDataTable(res, datatable1, datatable2) {
   var json = JSON.stringify({datatable1: datatable1, datatable2: datatable2})
   res.write(json)
   res.end();
}

function sendResponseStatus(res, value) {
   if(value && value?.length > 0){
      if(value[0].code == 200){
         var json = JSON.stringify({datatable1: []})
         res.write(json)
         res.end();
      }else{
         res.statusCode = 404
         res.write(value[0]?.message ?? 'No se resolvio la solicitud')
         res.end();
      }
   }else{
      res.statusCode = 404
      res.write('Error al ejecutar la solicitud')
      res.end();
   }
}

function error(res, message, code) {
   res.statusCode = code ?? 404
   res.write(message)
   res.end();
}

function use(request) {
   data = data.concat(request.values)
}

async function useSsl(path, password){
   var exists = fs.existsSync(path)
   if(exists) server_options = {pfx: fs.readFileSync(path), passphrase: password};
}

function cors() { useCors = true }

function listen(port, execute) { 
   if(server_options) instance = https.createServer(server_options, server_requests)
   else instance = http.createServer(server_requests)
   instance.listen(port, execute()); 
}
function listen(port, hostname, execute) { 
   if(server_options) instance = https.createServer(server_options, server_requests)
   else instance = http.createServer(server_requests)
   instance.listen(port, hostname, execute()); 
}


module.exports = server