const mongoose        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema          = mongoose.Schema;


const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'Precio unitario es necesario']
    },
    descripcion: {
        type: String
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario' 
    }
});


productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico. ---{TYPE}--- ---{VALUE}--- ' });
module.exports = mongoose.model('Producto', productoSchema);
