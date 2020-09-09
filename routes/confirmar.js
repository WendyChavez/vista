const {Router} = require('express');
const router = Router();
const {confirmar} = require('../controllers/confirmar');

router.route('/')
    .get(confirmar);

module.exports = router;