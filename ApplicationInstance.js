var data = {
   connection:{},
   business:[],
   intentPass: 0,
   timePass: 0,
   intentBots: 0,
   tokenKey: '',
}

var ips = []
var devices = []

function setData(initialData){
   data = initialData
}

function getBusiness(id){
   if(id == 0) return data
   else return data.business.find(x => x.id == id)
}

function getConnection(id){
   if(id == 0) return data.connection
   else return data.business.find(x => x.id == id)?.connection
}

module.exports = {data, ips, devices, setData, getBusiness, getConnection}
