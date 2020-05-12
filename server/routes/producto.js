const express                               = require('express');
const { verificaToken, verifica_AdminRole } = require('../middlewares/autentificacion');
const app                                   = express();
const Producto                             = require('../models/producto');



app.get('/productos', verificaToken, (req, res) => {

    let page  = Number(req.query.page)  || 0;
    let limit = Number(req.query.limit) || 0;

    // Listar todos los productos que no estan borrados y ordernar por el nombre del producto
    Producto.find({estado: true})
    .populate('usuario', 'nombre mail')
    .populate('categoria', 'descripcion')
    .skip(page)
    .limit(limit)
    .sort('nombre')
    .exec( (err, productos) => {

        if(err)
        {
            res.status(500).json({
                ok: false,
                error: err
            });
            return;
        }
        else
        {
            res.json({
                ok: true,
                productos
            });
        }
    });
});


app.get('/productos/:id',verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre mail')
        .populate('categoria', 'descripcion')
        .exec( (err, productoFound) => {
        
            if(err)
            {
                res.status(500).json({
                    ok: false,
                    error: err
                });
                return;
            }
            else
            {
                if(!productoFound)
                {
                    res.status(500).json({
                        ok: false,
                        error: `No existe producto con el id ${id}`
                    });
                    return;
                }
                else
                {
                    res.json({
                        ok: true,
                        productoFound
                    });
                }
            }
    });
});



// Buscar por termino
app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    /*
        Es la manera de realizar una consuta LIKE como en SQL
        para ello se utiliza exprecion regular indicando la i
        que significa que el termino no sera sensible a minusculas y mayusculas.
    */
    let regex = new RegExp (termino, 'i');

    Producto.find({nombre: regex, estado: true})
            .populate('categoria', 'descripcion')
            .exec( (err, productoFound) => {

                if(err)
                {
                    res.status(500).json({
                        ok: false,
                        error: err
                    });
                    return;
                }
                else
                {
                    if(!productoFound)
                    {
                        res.status(500).json({
                            ok: false,
                            error: `No existe producto con el id ${id}`
                        });
                        return;
                    }
                    else
                    {
                        res.json({
                            ok: true,
                            productoFound
                        });
                    }
                }

            })

});


app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let usuarioId = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: usuarioId
    });

    producto.save( (err, productoStored) => {
        
        if(err)
        {
            res.status(500).json({
                ok: false,
                error: err
            });
            return;
        }
        else
        {
            res.json({
                ok: true,
                productoStored
            });
        }
    });
});



app.put('/productos/:id', [verificaToken, verifica_AdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let usuarioId = req.usuario._id;

    let dataEditProduct = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        estado: body.estado,
        categoria: body.categoriaId,
        usuario: usuarioId
    }

    Producto.findByIdAndUpdate(id, dataEditProduct, {new: true, runValidators: true, context: 'query'}, (err, productoEdited) => {

        if(err)
        {
            res.status(500).json({
                ok: false,
                error: err
            });
            return;
        }
        else
        {
            if(!productoEdited)
            {
                res.status(500).json({
                    ok: false,
                    message: `El producto con id ${id} no existe`
                });
                return;
            }
            else
            { 
                res.json({
                    ok: true,
                    productoEdited
                });
            }
        }
    });
});



app.delete('/productos/:id', [verificaToken, verifica_AdminRole], (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoDelited) => {

        if(err)
        {
            res.status(500).json({
                ok: false,
                error: err
            });
            return;
        }
        else
        {
            if(!productoDelited)
            {
                res.status(500).json({
                    ok: false,
                    message: `El producto con id ${id} no existe`
                });
                return;
            }
            else
            { 
                res.json({
                    ok: true,
                    productoDelited
                });
            }
        }
    });
});



app.delete('/productos', [verificaToken ,verifica_AdminRole], (req, res) => {

    let id = req.body.id;

    Producto.findByIdAndUpdate(id, {estado: false}, (err, productoEdited) => {

        if(err)
        {
            res.status(500).json({
                ok: false,
                error: err
            });
            return;
        }
        else
        {
            if(!productoEdited)
            {
                res.status(500).json({
                    ok: false,
                    message: `El producto con id ${id} no existe`
                });
                return;
            }
            else
            { 
                res.json({
                    ok: true,
                    productoEdited
                });
            }
        }
    });
});



module.exports = app;