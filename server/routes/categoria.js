const express                               = require('express');
const { verificaToken, verifica_AdminRole } = require('../middlewares/autentificacion');
const app                                   = express();
const Categoria                             = require('../models/categoria');



// Obtener todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .populate('usuario', 'nombre email') // Obtiene los datos de la relacion categoria usuario
    .sort('descripcion')
    .exec( (err, categorias) => {
        
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
                categorias
            });
        }
    });
});



// Obtener una categoria a partir de su ID
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaFound) => {
        
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
            if(!categoriaFound)
            {
                res.status(500).json({
                    ok: false,
                    error: `No existe categoria con el id ${id}`
                });
                return;
            }
            else
            {                    
                res.json({
                    ok: true,
                    categoria: categoriaFound
                });
            }
        }
    });
});



// Insertar categorias
app.post('/categoria', verificaToken, (req, res)=> {

    let categoriaData = req.body;

    let categoria = new Categoria({
        descripcion: categoriaData.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaStored) => {

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
            if(!categoriaStored)
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
                    categoriaStored
                });
            }
        }
    });
});



// Modificar categoria
app.put('/categoria/:id', [verificaToken, verifica_AdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, {descripcion: body.descripcion}, {new: true, runValidators: true, context: 'query'}, (err, categoriaEdited) => {

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
            if(!categoriaEdited)
            {
                res.status(500).json({
                    ok: false,
                    error: `No existe categoria con el id ${id}`
                });
                return;
            }
            else
            {                    
                res.json({
                    ok: true,
                    categoriaEdited
                });
            }
        }
    });
});



// Borrar fisicamente una categoria
app.delete('/categoria/:id', [verificaToken, verifica_AdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelited) => {

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
            if(!categoriaDelited)
            {
                res.status(500).json({
                    ok: false,
                    error: `No existe categoria con el id ${id}`
                });
                return;
            }
            else
            {                    
                res.json({
                    ok: true,
                    message: `La categoria: ${categoriaDelited.descripcion} fue eliminada correctamente`
                });
            }
        }
    });
});



// Borrar una categoria cambiandole el estado
app.delete('/categoria', [verificaToken, verifica_AdminRole], (req, res) => {

    let id = req.body.id;

    Categoria.findByIdAndUpdate(id, {estado: false}, {new: true} , (err, categoriaDelited) => {

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
            if(!categoriaDelited)
            {
                res.status(500).json({
                    ok: false,
                    error: `No existe categoria con el id ${id}`
                });
                return;
            }
            else
            {                    
                res.json({
                    ok: true,
                    message: `La categoria: ${categoriaDelited.descripcion} fue eliminada correctamente`
                });
            }
        }
    });
});



module.exports = app;