

const {Router} = require('express');
const router = Router();
const {confirmar} = require('../controllers/confirmar');


router.route('/')
    .post(confirmar);


router.get('/confirmar', (req, res) => {
    res.sendFile("ErrorConfirmacion.html", {root: './public/'});
})

module.exports = router;