const getrequest = require('./getrequest.js');
const devicecmd = require('./devicecmd.js');
const cdata = require('./cdata.js');
const ping = require('./ping.js');
const server = require('../../httpSystem/server')

const router = server().router();

router.middleware('ping', getrequest.getGetRequest);

router.get('getrequest', getrequest.getGetRequest);
router.post('getrequest', getrequest.postGetRequest);

router.get('devicecmd', devicecmd.getDevicecmd);
router.post('devicecmd', devicecmd.postDevicecmd);

router.get('cdata', cdata.getCdata);
router.post('cdata', cdata.postCdata);

router.get('ping', ping.getPing);
router.post('ping', ping.postPing);

module.exports = router;