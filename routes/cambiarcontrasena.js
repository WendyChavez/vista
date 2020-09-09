const {Router} = require('express');
const router = Router();
const {cambiar} = require('../controllers/cambiarcontrasena');


    router.route('/')
    .post(cambiar);


    router.get('/cambiar', (req, res) => {
        res.sendFile("ErrorRestablecerContrasena.html", {root: './public/'});
    })

    router.get('/restablecer ', (req, res) => {
        res.sendFile("RestablecerContrasena.html", {root: './public/'});
    })

module.exports = router;