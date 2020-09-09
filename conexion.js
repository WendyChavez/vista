var mongoose = require('mongoose');

var uri = 'mongodb://127.0.0.1:27017/aforo';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'ERROR AL CONECTAR CON AFORO'));
db.once('open', function() {
  console.log(`Conectado a Aforo (${uri})`);
});
