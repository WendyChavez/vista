const {Router} = require('express');
const router = Router();
const {recuperar} = require('../controllers/recuperar');

router.route('/')
    .post(recuperar);

module.exports = router;