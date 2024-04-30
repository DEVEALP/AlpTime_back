const settings = require('./settings');
const server = require('../../httpSystem/server');
const router = server().router();

router.get('get', settings.get);

router.post('set', settings.set);


module.exports = router;