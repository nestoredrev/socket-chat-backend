const config     = require('./config/config');
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const app        = express();


//app.use es para asignar los middleware, es decir todas las peticiones que se realizan se ejecutaran los middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Configuración global de las rutas
app.use( require('./routes/index') );

mongoose.connect(config.db,
                { 
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    autoIndex: true,
                    useFindAndModify: false
                }, 
                (err, res) => {
    if(err) throw `Ha ocorrido un error a la conexion de la BBDD ---> ${err}`;
    else console.log(`Base de datos ${res.name} online`);
});
 
app.listen(config.port, () => {
    console.log(`Escuchando en el puerto ${config.port}`);
});