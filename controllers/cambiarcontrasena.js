const Usuarios = require('../models/Usuarios');
const fs = require('fs');
const controladorCambiarContrasena = {};

controladorCambiarContrasena.cambiar = async (req,res) => {
    console.log(">>>",req.body.user);
    const usuarios = await Usuarios.countDocuments({ user: req.body.user,  token: req.body.token, active : true });
    var date = new Date();
    var fechaAnio = new Date().toISOString().slice(0, 10);
    var fecha = fechaAnio + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if(usuarios == 0){
        fs.appendFile('./logs/ataques.txt', `[${fecha}] No autorizado EMAIL:${req.body.user} TOKEN:${req.body.token}\n`,() => {});
        res.json({
            'status': false,
            'message': 'Error en las credenciales.'
        });
    }else if(usuarios == 1){
        const usuarioActualizado = await Usuarios.updateOne({ user: req.body.user, token: req.body.token }, { pass : req.body.pass });
        res.json({
            'status': true,
            'message': 'Se ha restablecido su contraseña.'
        });
    }else{
        fs.appendFile('./logs/inconsistencias.txt', `[${fecha}] Hay más de un usuarios con EMAIL:${req.body.user}\n`,() => {});
        res.json({
            'status': false,
            'message': 'Error al restablecer su contraseña, por favor contacte a soporte.'
        });
    }
};
module.exports = controladorCambiarContrasena;
