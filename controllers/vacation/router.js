const vacation = require('./vacation');
const server = require('../../httpSystem/server');
const router = server().router();

router.get('holidays', vacation.holidays);
router.post('get', vacation.get);
router.post('asing', vacation.asing);

module.exports = router;