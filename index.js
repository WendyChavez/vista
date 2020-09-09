require('./conexion');
const express = require('express');
const morgan = require('morgan');
const server = express();

const PORT = 3001;

server.use(express.json());
server.use(morgan('dev'));
server.use(express.static('public'));

server.use('/api/registrar', require('./routes/registrar') );
server.use('/api/recuperar', require('./routes/recuperar') );
server.use('/api/confirmar', require('./routes/confirmar') );
server.use('/api/cambiarcontrasena', require('./routes/cambiarcontrasena') );
server.use('/api/auth', require('./routes/auth') );
server.use('/api/contar', require('./routes/contar') );
server.use('/api/renombrar', require('./routes/renombrar') );
server.use('/api/conectar', require('./routes/conectar') );



server.listen(PORT, () => {
    console.log(`Corriendo en el puerto ${PORT}`);
});
