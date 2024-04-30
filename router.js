
const server = require('./httpSystem/server')
const auth = require('./controllers/auth')
const validateToken = require('./middleware/validateToken')
const iclock = require('./middleware/iclock')
const router_iclock = require('./controllers/iclock/router')
const router_device = require('./controllers/device/router')
const router_report = require('./controllers/report/router')
const router_vacation = require('./controllers/vacation/router')
const router_turn = require('./controllers/turn/router')
const router_permission = require('./controllers/permission/router')
const router_settings = require('./controllers/settings/router')
const router = server().router();

router.middleware('/api/dashboard', validateToken)
router.middleware('/iclock', iclock)

router.router('/api/dashboard/vacation', router_vacation) 
router.router('/api/dashboard/report', router_report) 
router.router('/api/dashboard/device', router_device) 
router.router('/api/dashboard/turn', router_turn) 
router.router('/api/dashboard/permission', router_permission) 
router.router('/api/dashboard/settings', router_settings) 

router.post('/api/auth/auth', auth.login)
  
router.router('/iclock', router_iclock)
// router

module.exports = router;