const turn = require('./turn');
const server = require('../../httpSystem/server');
const router = server().router();

router.post('get', turn.get);

router.post('calendar/get', turn.getCalendar);

router.post('asing', turn.asing);

router.post('users', turn.users);

module.exports = router;