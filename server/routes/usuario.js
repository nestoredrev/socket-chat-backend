const express    = require('express');
const bcrypt     = require('bcrypt');
const _          = require('underscore'); // underscorejs  es una libreria de malipulacion de objetos y arrays
const app        = express();
const Usuario = require('../models/usuario');

app.get('/', (req, res) => {
    res.json('Welcome to my API RESTFULL with Nodejs');
});

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    /*
        En el caso de que halla mil usuario lo suyo es segmentar la informacion
        con skip asignamos desde que documento queremos visualizar la infromacion
        y con limit cuantos registros mostrar
    */

     /*
        En el find en {} es la condicion where de sql si {} esta vacio es como si fuera SELECT * FROM usuarios
        y en el segundo argumento los campos que queremos
     */
    Usuario.find({estado: true}, 'nombre email role estado google img')
           .skip(desde)
           .limit(limite)
           .exec( (err, usuarios) => {

            if(err)
            {
                res.status(400).json({
                    ok:false,
                    error: err
                });
                return;
            }
            else
            {
                Usuario.countDocuments({estado: true}, (err, total) => {
                    res.json({
                        ok: true,
                        usuarios,
                        total: total
                    });  
                });
            }

           })

});

app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, 10),
        img:      body.img,
        rol:      body.rol 
    });

    usuario.save( (err, usuarioDB) => {
        if(err)
        {
            res.status(400).json({
                ok:false,
                error: err
            });
            return;
        }
        else
        {
            res.status(200).json({
                usuarioStored: usuarioDB
            });
        }
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    // pick devuelve una copia de las propiedades seleccionadas en el array
    // para excluir propiedades que no nos interesa por ejemplo la contraseña o el estado de google
    let body = _.pick(req.body,['nombre','email','img','rol','estado']);
    console.log(body);


    // new true nos devuelve el objeto del usuario modificado
    // runValidators true ejecuta las validaciones especificadas en el Schema del usuario
    // Por razones tecnicas al utilizar runValidators hay que añadir el context: 'query' segun el plugin mongoose-unique-validator
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usuarioEdited)=>{

        if(err)
        {
            res.status(400).json({
                ok:false,
                error: err
            });
            return;
        }
        else
        {
            res.json({
                ok:true,
                usuario: usuarioEdited
            });
        }
    });

    
});


// Borrar fisicamente el usuario de la coleccion
app.delete('/usuario/:id', (req, res) => {
    
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {
        if(err)
        {
            res.status(400).json({
                ok:false,
                error: err
            });
            return;
        }
        else
        {
            if(!usuarioDeleted)
            {
                res.status(400).json({
                    ok:false,
                    error: `El usuario con id: ${id} no existe`
                });
            }
            else
            {
                res.json({
                    ok: true,
                    usuario: usuarioDeleted
                });
            }
        }
    });
});

/*
    Cambiando el estado del usuario como eliminado sin borrarlo fisicamente
    pero recibiendo el id en el body
*/
app.delete('/usuario', (req, res) => {

    let id = req.body.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioDeleted) => {

        if(err)
        {
            res.status(400).json({
                ok:false,
                error: err
            });
        }
        else
        {
            res.json({
                ok: true,
                usuario: usuarioDeleted
            });
        }

    });


})


module.exports = app;