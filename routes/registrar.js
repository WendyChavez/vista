

const {Router} = require('express');
const router = Router();
const {registrar} = require('../controllers/registrar');

router.route('/')
    .post(registrar);

router.get('/registro', (req, res) => {
    res.sendFile("RegistroExitoso.html", {root: './public/'});
})

module.exports = router;