const device = require('./device');
const server = require('../../httpSystem/server')

const router = server().router();

router.post('options', device.options);
router.post('get', device.get);

router.post('process/get', device.getProcess);
router.post('process/options', device.processOptions);

router.post('records/get', device.records);
router.post('records/async', device.recordsAsync);
router.post('records/options', device.recordOptions);

router.post('users/get', device.getUsers);
router.post('users/options', device.usersOptions);

router.post('report_old', device.report_old);
router.post('report_old2', device.report_old2);

router.get('groups/get', device.getGroups);
router.get('options/get', device.getOptions);
router.get('calendar/get', device.getCalendar);

router.get('clear', device.clear);

module.exports = router;