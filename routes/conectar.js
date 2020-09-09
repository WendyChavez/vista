const {Router} = require('express');
const router = Router();
const {conectar} = require('../controllers/conectar');

router.route('/')
    .put(conectar);

module.exports = router;