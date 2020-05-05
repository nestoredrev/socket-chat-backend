const config     = require('../config/config');
const express    = require('express');
const bcrypt     = require('bcrypt');
const _          = require('underscore');
const jwt        = require('jsonwebtoken');
const Usuario    = require('../models/usuario');
const app        = express();


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
                    error: `Usuario o contraseña incorrectos`
                });
                return;
            }
            else
            { 
                if( !bcrypt.compareSync(body.password, usuarioFound.password) )
                {
                    res.status(400).json({
                        ok: false,
                        error: `Usuario o contraseña incorrectos`
                    });
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

let generarToken = (usuario) => {
    return jwt.sign({
        payloadUsuario: usuario // Payload o datos de session
      }, 
      config.seed,
      { expiresIn: config.expiracion_token });
}


module.exports = app;
