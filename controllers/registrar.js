require('../conexion');
const Registro = require('../models/Registros');
const Usuario = require('../models/Usuarios');
const nodemailer = require('nodemailer');
const fs = require('fs');
const controladorRegistrar = {};
const time = new Date(Date.now()).toString();

controladorRegistrar.registrar = async (req,res) => {
    const usuarios = await Usuario.find({"user":req.body.email});
    if (usuarios.length === 1){
        res.json({
            'status': false,
            'message':'El usuario ya está registrado'
        });
    } else if (usuarios.length === 0){
        const registros = await Registro.find({"email": req.body.email});
        if (registros.length > 1) {
            fs.appendFile('./logs/ataques.txt', `[${time}]: Registros: ${req.body.email}\n`,() => {});
            res.json({
                'status': false,
                'message':'Alcanzo el límite de intentos de registrarse.'
            });

        }else{
            const updateActive = await Registro.updateMany({"email": req.body.email},{$set:{"active":false}},{"multi":true});
            const nuevoRegistro = new Registro({
                email:  req.body.email,
                pass:   req.body.pass
            });
            const registro = await nuevoRegistro.save();
            await sendEmail(req.body.email, req.body.pass, registro.token);
            res.json({
                'status': true,
                'message':'Se le ha enviado un correo.'
            });
        }
    } else{
        fs.appendFile('./logs/inconsistencias.txt', `[${time}]: Hay más de un usuario con el mail ${req.body.email}\n`,() => {});
        res.json({
            'status': false,
            'message':'Error en el registro, por favor contacte a soporte.'
        });
    }
};

async function sendEmail(destinatario, password, token) {
    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: "riverosgarciaivan@gmail.com",
            pass: "IvanRiveros19$",
        },
    });
    let info = await transporter.sendMail({
        from: '"Ivan" <riverosgarciaivan@gmail.com>',
        to: destinatario,
        subject: "Creación de cuenta en la App Counter CAD&LAN",
        text: "Activación de cuenta",
        html: `
                <p>Para validar su correo y activar su cuenta porfavor ingrese al siguiente link <---<a href="http://52.203.1.191:3001/activacion?id=${token}"> http://52.203.1.191:3001/activacion?id=TOKEN_ACTIVACION</a></p> 
                <br>
                <br>
                <b>Usuario: </b> ${destinatario}
                <br> 
                <b>Contraseña: </b> ${password}
                <p>Atentamente <br> El equipo de Cad&Lan México</p>
                <p><b>Nota:</b> No responda a este mensaje de correo electrónico. El mensaje se envió desde una dirección que no puede aceptar correo electrónico entrante.</p>
                `,
    });
    console.log("Message sent: %s", info.messageId);
}

module.exports = controladorRegistrar;
