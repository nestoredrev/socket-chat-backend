const express = require('express');
const Conversacion = require('../models/conversacion_privada');
const app = express();


app.post('guardarMensaje', (req, res) => {
        console.log(req.body);
        res.status(200).json({
            ok: true,
            data: req.body
        })
})

module.exports = app;