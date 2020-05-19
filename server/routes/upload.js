const config                                = require('../config/config');
const express                               = require('express');
const { verificaToken, verifica_AdminRole } = require('../middlewares/autentificacion');
const fileUpload                            = require('express-fileupload');
const path                                  = require('path');
const fs                                    = require('fs');
const app                                   = express();
const Usuario                               = require('../models/usuario');
const Producto                              = require('../models/producto');

// default options
/*
    50MB limite de archivo si es mas de 50 MB lo subira hasta 50MB
    por lo tanto hay que controlar el tamaño de archivo manualmente.
*/
app.use( fileUpload({   useTempFiles: true, 
                        tempFileDir: path.resolve(__dirname, '/uploads/temp/'),
                        abortOnLimit: true,
                        responseOnLimit: 'Archivo demasiado grande',
                        limits: { fileSize: config.max_size_file,
                                  files: 10  // 10 Archivos como maximo
                                }, 
                    }));

app.post('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo.toLocaleLowerCase();
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0)
    {
        return res.status(400).json({
            ok: false,
            message: `No se ha seleccionado ningun archivo`
        });
    }

    // Validar tipos validos
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo) < 0)
    {
        return res.status(400).json({
            ok: false,
            message: `El tipo ${tipo} no es valido`,
            tiposPermitidos: `Los tipos permitidos son: ${tiposValidos.join(', ')}`
        });
    }

    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name;
    let tamanoArchivo = archivo.size;
    let nombreSegmentado = nombreArchivo.split('.');
    let extensionArchivo = nombreSegmentado[nombreSegmentado.length -1];

    // Valitar tamaño de archivo max 50MB
    if(tamanoArchivo > config.max_size_file)
    {
        return res.status(400).json({
            ok: false,
            message: `Tamaño maximo permitido para subir es ${ config.max_size_file / 1024 / 1024 } MB`,
            sizeToUpload: `${ tamanoArchivo / 1024 / 1024 } MB`
        });
    }
    
    // Valitar extension de archivo
    let extensionesPermitidas = ['png', 'jpeg', 'jpg', 'gif'];

    if(extensionesPermitidas.indexOf(extensionArchivo) < 0)
    {
        return res.status(400).json({
            ok: false,
            message: `Las extensiones permitidas son: ${ extensionesPermitidas.join(', ') }`,
            ext: extensionArchivo
        });
    }

    // Subir archivo
    let nuevoNombreArchivo = `${ id }_${ new Date().getTime() }.${ extensionArchivo }`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nuevoNombreArchivo }`, (err) => {
        
        if (err)
        {   
            return res.status(500).json({
                ok: false,
                error: err
            });
        }


        // Aqui la imagen ya esta subida. Hay que referenciarla tambien en la bbdd
        switch(tipo)
        {
            case 'usuarios':
                imagenUsuario(id, res, nuevoNombreArchivo, tipo);   
            break;

            case 'productos':
                imagenProducto(id, res, nuevoNombreArchivo, tipo);
            break;
        }
    });
});


function imagenUsuario(id, res, nombreArchivo, tipo)
{
    Usuario.findById(id, (err, usuarioFound) => {
        
        if (err)
        {
            borrarArchivo(tipo, nombreArchivo);   
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!usuarioFound)
        {
            borrarArchivo(tipo, nombreArchivo);
            return res.status(500).json({
                ok: false,
                error: `El usuario con id: ${ id } no existe`
            }); 
        }

        // Antes de subir una foto nuevo podemos borrar la anterior si existe, si no queremos tener una acomulacion/historial de fotos
        borrarArchivo(tipo, usuarioFound.img);

        usuarioFound.img = nombreArchivo;
        usuarioFound.save((err, usuarioStored) => {
            
            if (err)
            {   
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioStored,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo, tipo)
{
    Producto.findById(id, (err, productoFound) => {
        
        if (err)
        {   
            borrarArchivo(tipo, nombreArchivo);
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!productoFound)
        {
            borrarArchivo(tipo, nombreArchivo);
            return res.status(500).json({
                ok: false,
                error: `El producto con id: ${ id } no existe`
            }); 
        }

        borrarArchivo(tipo, productoFound.img);

        productoFound.img = nombreArchivo;
        productoFound.save((err, productoStored) => {
            
            if (err)
            {   
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                producto: productoStored,
                img: nombreArchivo
            });
        });
    });
}


function borrarArchivo(tipo, nombreArchivo)
{
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if( fs.existsSync(pathImagen) )
    {
        fs.unlinkSync(pathImagen);
    }
}



module.exports = app;