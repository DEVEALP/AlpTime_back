const sharp = require('sharp');

function getObjectFromString(string, separate){
   var mobject = {}
   var lines = string.split(separate)
   for(let line of lines){
      var subitems = line.split('=')
      mobject[subitems[0]] = subitems[1] ?? ''
   }
   return mobject
}

function printTextColorRed(texto){
   console.log('\x1b[31m%s\x1b[0m', texto)
}


function resizeImageBase64(inputBase64, width, height) {
   return new Promise((resolve, reject) => {
     try {
       const inputBuffer = Buffer.from(inputBase64, 'base64'); 
       sharp(inputBuffer).resize(width, height).toBuffer().then((outputBuffer) => { resolve(outputBuffer.toString('base64')); }).catch((error) => { reject(error); });
     } catch (error) {
       reject(error);
     }
   });
 }
 

module.exports = {getObjectFromString, printTextColorRed, resizeImageBase64}
