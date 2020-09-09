const Usuarios = require('../models/Usuarios');
const Recuperar = require('../models/Recuperar');
const nodemailer = require('nodemailer');
const fs = require('fs');
const controladorRecuperar = {};

controladorRecuperar.recuperar = async (req, res) => {
    console.log(">>>", req.body.email);
    const usuarios = await Usuarios.countDocuments({ user: req.body.email, active: true });
    var date = new Date();
    var fechaCorreo = new Date().toISOString().slice(0, 10);
    var fecha = fechaCorreo + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var mins = ('0'+date.getMinutes()).slice(-2);
    var hora = date.getHours() + ':' + mins;
    if (usuarios == 0) {
        res.json({
            'status': false,
            'message': 'Usuarios no registrado.'
        });
    } else if (usuarios == 1) {
        const recuperar = await Recuperar.countDocuments({ email: req.body.email });
        if (recuperar > 100) {
            res.json({
                'status': false,
                'message': 'Alcanzo el límite de intentos para recuperar su contraseña.Por favor contacte a soporte.'
            });
        } else {
            const recuperarActualizado = await Recuperar.updateMany({ email: req.body.email }, { active: false });
            const nuevoRecuperar = new Recuperar({
                email: req.body.email
            });
            const recuperar = await nuevoRecuperar.save();
            await sendEmail(recuperar.email, recuperar.token, fechaCorreo, hora);
            res.json({
                'status': true,
                'message': 'Se le ha enviado un correo para restablecer su contraseña.'
            });
        }
    } else {
        fs.appendFile('./logs/inconsistencias.txt', `[${fecha}] Hay más de un usuarios con EMAIL:${req.body.user} PASS:${req.body.pass}\n`, () => { });
        res.json({
            'status': false,
            'message': 'Error en el login, por favor contacte a soporte.'
        });
    }
};
async function sendEmail(destinatario, token, fecha, hora) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "riverosgarciaivan@gmail.com",
            pass: "IvanRiveros19$",
        },
    });
    let info = await transporter.sendMail({
        from: '"Ivan" <riverosgarciaivan@gmail.com>',
        to: destinatario,
        subject: "Restauración de contraseña en la App Counter CAD&LAN",
        text: "Recuperación de contraseña",
        html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Counter CAD&LAN</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                <body style="margin: 0; padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                            <td  bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>                               
                                    <td>                               
                                        <div align="center"><img src="cid:logo"></div>                              
                                    </td>                               
                                </tr>
                                </table>
                            </td>
                        </tr>
                    <tr>
                    <td bgcolor="#ffffff">
                        <h1 align="center">Recuperación de contraseña</h1>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        Estimado usuario.
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br>
                        Se ha recibido una solicitud para restablecer su contraseña..
                        <br>
                        <br>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <strong>Email: </strong>${destinatario} 
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <strong>Fecha: </strong>${fecha}
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <strong>Hora: </strong>${hora} 
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <strong>Para restablecer la contraseña de su cuenta porfavor ingrese al siguiente link: </strong>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br>
                        <a href="http://52.203.1.191:3001/confirmarrecuperar?email=${destinatario}&token=${token}">http://52.203.1.191:3001/api/confirmarrecuperar?email=EMAIL&token=TOKEN</a>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br>
                        <br>
                        <div align="center"><p>Atentamente <br>El equipo de Cad&Lan México </p></div>
                        <br>
                    </td>
                    </tr>
                    </table>
                </td>
                </tr>
                </table>
                <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                <div align="center"> 
                    <b>Nota:</b> No responda a este mensaje de correo electrónico. El mensaje se envió desde una dirección que no puede aceptar correo electrónico entrante.</p>
                    </div>
                    </td>
                </body>
                </html>
                `,
        attachments: [{
            filename: 'logo.jpeg',
            path: './img/logo.jpeg',
            cid: 'logo' //same cid value as in the html img src
        }]
    });
    console.log("Message sent: %s", info.messageId);
}
module.exports = controladorRecuperar;
