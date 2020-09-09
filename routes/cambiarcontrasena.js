const {Router} = require('express');
const router = Router();
const {cambiar} = require('../controllers/cambiarcontrasena');


router.route('/')
    .post(cambiarcontrasena);

router.get('/restablecercontrasena', (req, res) => {
    res.sendFile("restablecercontrasena.html", {root: './public/'});
})

router.get('/ErrorRestablecerContrasena', (req, res) => {
    res.sendFile("ErrorRestablecerContrasena.html", {root: './public/'});
})

module.exports = router;