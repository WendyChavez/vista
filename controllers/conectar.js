const Usuarios = require('../models/Usuarios');
const controladorConectar = {};

controladorConectar.conectar = async (req, res) => {
    console.log(req.body.token);
    console.log(req.body.id_user);
    console.log(req.body.id_counter);
    console.log(req.body.token_counter);
    console.log(req.body.type);
    const count = await Usuarios.countDocuments({ id_user: req.body.id_user, token: req.body.token });
    if (count === 0) {
        res.json({
            'status': false,
            'message': 'Error de autorización'
        });
    } else if (count === 1) {
        const usuarioActual = await Usuarios.findOne({ id_user: req.body.id_user, token: req.body.token });
        const usuarioExterno = await Usuarios.findOne({ id_counter: req.body.id_counter, token_counter: req.body.token_counter });
        if (usuarioActual && usuarioExterno) {
            let accion = '';
            let counter = 0;
            let idcounter = '';
            switch (req.body.type) {
                case -1:
                    idcounter = '';
                    accion = 'Desconectado correctamente';
                    counter = usuarioActual.val_counter;
                    break;
                case 1:
                    idcounter = req.body.id_counter;
                    accion = 'Conectado correctamente';
                    counter = usuarioExterno.val_counter;
                    break;
            }
            const usuarioActualizado = await Usuarios.updateOne({ id_user: req.body.id_user }, { id_counter_ext: idcounter });
            res.json({
                'status': true,
                'message': accion,
                'display': counter
            });
        } else {
            res.json({
                'status': false,
                'message': 'Conectado/Desconectado incorrectamente'
            });
        }
    } else {
        res.json({
            'status': false,
            'message': 'Error desconocido'
        });
    }


};

module.exports = controladorConectar;
