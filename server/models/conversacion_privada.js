const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversacionSchema = new Schema({

    mensajes: [{
        from:    { type: Schema.Types.ObjectId, ref: 'Usuario', require: true },
        to:      { type: Schema.Types.ObjectId, ref: 'Usuario', require: true },
        fecha:   { type: Date, default: Date.now },
        mensaje: { type: String, require: true }
    }]

});


module.exports = mongoose.model('Conversacion', conversacionSchema);