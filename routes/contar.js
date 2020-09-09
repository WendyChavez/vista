const {Router} = require('express');
const router = Router();
const {contar,display} = require('../controllers/contar');

router.route('/')
    .get(display);

router.route('/')
    .put(contar);
module.exports = router;