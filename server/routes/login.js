const config     = require('../config/config');
const express    = require('express');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
var admin        = require('firebase-admin');
const Usuario    = require('../models/usuario');
const app        = express();

var serviceAccount = require("./cafe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cafe-nodejs-1588760844645.firebaseio.com"
});


app.post('/login', (req, res) => {
    
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioFound) => {

        if(err)
        {
            res.status(500).json({
                ok:false,
                error: err
            });
            return;
        }
        else
        {
            if(!usuarioFound)
            {
                res.status(400).json({
                    ok: false,
                    error: `Usuario o contraseña incorrectos 111`
                });
                return;
            }
            else
            { 
                if( !bcrypt.compareSync(body.password, usuarioFound.password) )
                {
                    res.status(400).json({
                        ok: false,
                        error: `Usuario o contraseña incorrectos 222`
                    });
                    return;
                }
                else
                {
                    res.json({
                        ok: true,
                        usuario: usuarioFound,
                        token: generarToken(usuarioFound)
                    });
                }
            }
        }

    });
});


async function verify( token ) {

    const payload =  await admin.auth().verifyIdToken(token);
    console.log(payload);
    return {
        nombre: payload.name || '',
        email: payload.email || '',
        img: payload.picture || '',
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.token;

    let usuarioGoogle = await verify(token)
                              .catch(err => {
                                res.status(403).json({
                                    ok: false,
                                    message: err.code
                                });
                              });
    
    Usuario.findOne( { email: usuarioGoogle.email} , (err, usuarioDB) => {

        if(err)
        {
            res.status(500).json({
                ok:false,
                error: err
            });
            return;
        }


        if(usuarioDB)
        {
            /*
                Si el mail del usuario existe pero no esta verificado por google
                se tiene que autentificar con mail y su contraseña. Si el mail existe 
                y esta verificado por google devolvemos los datos del usuario y el token.
            */
            if(usuarioDB.google === false)
            {
                res.status(500).json({
                    ok:false,
                    message: `Debe de utilizar autentificación normal`
                });
                return;
            }
            else
            {
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: generarToken(usuarioDB)
                });
            }
        }
        else
        {
            /*
                Si el mail no existe creamos el usuario con autentificacion de google.
            */
            let usuario = new Usuario({
                nombre: usuarioGoogle.nombre,
                email: usuarioGoogle.email,
                img: usuarioGoogle.img,
                google: true,
                password: ':)'
            });

            usuario.save( ( err, usuarioSaved )=> {
                if(err)
                {
                    res.status(500).json({
                        ok:false,
                        error: err
                    });
                    return;
                }
                else
                {
                    res.json({
                        ok: true,
                        usuario: usuarioSaved,
                        token: generarToken(usuarioSaved)
                    });
                }
            });
        }
    });
});

let generarToken = (usuario) => {
    return jwt.sign({
        payloadUsuario: usuario // Payload o datos de session
      }, 
      config.seed,
      { expiresIn: config.expiracion_token });
}


module.exports = app;