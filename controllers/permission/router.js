const permission = require('./permission');
const server = require('../../httpSystem/server');
const router = server().router();

router.post('get', permission.get);
router.get('motives/get', permission.getMotives);
router.post('asing', permission.asing);

module.exports = router;