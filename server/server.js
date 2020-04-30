const config     = require('./config/config');
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

//app.use es para asignar los middleware, es decir todas las peticiones que se realizan se ejecutaran los middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/', (req, res) => {
  res.json('hola Mundo');
});

app.get('/usuario', (req, res) => {

      res.json('get Usuario');
});

app.post('/usuario', (req, res) => {

      let data = req.body;
      res.status(200).json({
          usuario: data
      });
});

app.put('/usuario/:id', (req, res) => {

      let id = req.params.id;
      res.json({id});
});

app.delete('/usuario', (req, res) => {
      res.json('delete Usuario');
});
 
app.listen(config.port, () => {
    console.log(`Escuchando en el puerto ${config.port}`);
})