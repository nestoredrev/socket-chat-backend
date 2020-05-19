const config     = require('../config/config');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    /*
        De esta manera obtenemos el token que se encuentra
        en la cabezera de la peticion: Authorization.
    */
    let token = req.get('Authorization');

    jwt.verify(token, config.seed, (err, decoded) => {
        
        if(err)
        {
            return res.status(401).json({
                ok: false,
                err: err
            });
        }
        else
        {
            /*
                Una vez obtenido el Payload se puede asignar como parametro
                en el request, req en cada una de las rutas de la api
            */
            req.usuario = decoded.payloadUsuario;

            /*
                La funcion next es impresindible a la hora de utilizar middlewares
                ya que si no se llama la ejecucion del programa se quedara colgada.
                
                Hay que llamar la funcion next() para que el programa siga ejecutando lo que 
                viene a continuacion.
            */
            next();
        }

    });
}

// Para proteger la url de la foto hay que enviar el Token de la session del usuario
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, config.seed, (err, decoded) => {
        
        if(err)
        {
            return res.status(401).json({
                ok: false,
                err: err
            });
        }
        else
        {
            req.usuario = decoded.payloadUsuario;
            next();
        }

    });
}


let verifica_AdminRole = (req, res, next) => {
    
    let rol = req.usuario.rol;
    
    if(rol == 'ADMIN_ROLE')
    {
        next();
    }
    else
    {
        return res.status(401).json({
            ok: false,
            err: `No tiene permisos`
        });
    }
}

module.exports = {
    verificaToken,
    verificaTokenImg,
    verifica_AdminRole
}