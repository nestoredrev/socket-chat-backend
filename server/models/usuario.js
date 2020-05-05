const mongoose        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema          = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Correo electronico incorecto.']
    },
    password: {
        type: String,
        required: true,
        select: true // select:false no devolver ese campo cuando solicitamos los datos de algun usuario
    },
    img:{
        type: String
    },
    rol:{
        type: String,
        default: 'USER_ROLE',
        trim: true,
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});


//Una manera de eliminar el password del objeto de respuesta 
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico. ---{TYPE}--- ---{VALUE}--- ' });
module.exports = mongoose.model('Usuario', usuarioSchema);