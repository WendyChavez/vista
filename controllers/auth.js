const Usuarios = require('../models/Usuarios');
const fs = require('fs')
const controladorAuth = {};

controladorAuth.login = async (req,res) => {
    console.log(">>>",req.body.user,req.body.pass);
    const usuarios = await Usuarios.countDocuments({ user: req.body.user, pass : req.body.pass, active : true });
    var date = new Date();
    var fechaAnio = new Date().toISOString().slice(0, 10);
    var fecha = fechaAnio + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if (usuarios == 0){
        res.json({
            'status': false,
            'message':'Usuario o Contraseña incorrecta'
        });
    }else if(usuarios == 1){
        const usuario =  await Usuarios.findOne({ user: req.body.user, pass : req.body.pass, active : true });
        const TOKEN = 'ASD123';
        const usuarioActualizado = await Usuarios.updateOne({ user: req.body.user, pass : req.body.pass }, { token: TOKEN });
        res.json({
            'status': true,
            'message':'Logeado correctamente',
            'token': TOKEN
        });
    }else{
        fs.appendFile('./logs/inconsistencias.txt', `[${fecha}] Hay más de un usuario con EMAIL:${req.body.user} PASS:${req.body.pass}\n`,() => {});
        res.json({
            'status': false,
            'message':'Error en el login, por favor contacte a soporte'
        });
    }
};
module.exports = controladorAuth;
