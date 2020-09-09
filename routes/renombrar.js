const {Router} = require('express');
const router = Router();
const {renombrar} = require('../controllers/renombrar');

router.route('/')
    .put(renombrar);

module.exports = router;