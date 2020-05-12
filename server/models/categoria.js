const mongoose          = require('mongoose');
const uniqueValidator   = require('mongoose-unique-validator');
const Schema            = mongoose.Schema;

const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'El campo es obligatorio']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    estado: {
        type: Boolean,
        default: true
    }
}); 

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico. ---{TYPE}--- ---{VALUE}--- ' });
module.exports = mongoose.model('Categoria', categoriaSchema);