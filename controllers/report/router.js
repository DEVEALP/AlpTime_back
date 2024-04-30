const report = require('./report');
const server = require('../../httpSystem/server');
const router = server().router();

router.post('general', report.general);

module.exports = router;