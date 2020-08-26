const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { createMessage } = require('../utilidades/utilidades');
const usuario = new Usuarios();


io.on('connection', (client) => {

    const idUsuario = client.id; // id generado desde socket.io por cada sesion
    console.log('Usuario conectado ', idUsuario);

    client.on('usuarioLogeado', (sesionUsuario, callback) => {

        if(sesionUsuario)
        {
            let enterUsuario = usuario.addPersona(idUsuario, sesionUsuario.usuario);
            console.log('Persona entrante ---> ', enterUsuario);
            // Conectar el usuarios a sus salas correspondientes
            //client.join(sesionUsuario.usuario.salas);
            
            //Ver las salas existentes
            //console.log(client.adapter.rooms);

            // Notificar a todos quian se ha conectado
            client.broadcast.emit('msgEnterExit', {usuario: 'Admin', mensaje: `El usuario ${enterUsuario.nombre} se ha conectado`});
            client.broadcast.emit('listaUsuarios', usuario.getPersonas());

            // Notificar a las personas que estan en el mismo chat (mismo sala)
            //client.broadcast.to(sesionUsuario.usuario.salas).emit('listaUsuarios', usuario.getPersonas());
    
            callback(usuario.getPersonas());
        }
        else
        {
            callback({
                ok: false,
                msg: 'No se ha iniciado la sesion correctamente'
            })    
        }
    });


    // Responder al cliente con las personas conectadas
    client.on('getListaUsuarios', ({},callback) => {
        callback(usuario.getPersonas());
    });


    // Mensajes publicos 1 a N
    client.on('crearMensaje', (data, callback) => {

        let persona = usuario.getPersona(client.id);
        let mensaje = createMessage(persona.nombre, data.mensaje);
        
        client.broadcast.emit('recibirMensajeChat', mensaje);
        
        callback({
            ok: true,
            msg: 'Mensaje recibido'
        })
    });


    // Mensajes privados 1 a 1
    client.on('mensajePrivado', (data, callback) => {

        let persona = usuario.getPersona(client.id);
        let mensaje = createMessage(persona.nombre, data.mensaje);
        
        client.broadcast.to(data.id).emit('recibirMensajeChat', mensaje);

        callback({
            ok: true,
            msg: 'Mensaje privado recibido'
        })
    })





    client.on('disconnect', () => {
        let exitUsuario = usuario.delPersona(idUsuario);
        client.broadcast.emit('msgEnterExit', createMessage('Admin', `[ Disconect ] El usuario ${exitUsuario.nombre} ha salido`));
        client.broadcast.emit('listaUsuarios', usuario.getPersonas());

        
        // Notificar a las personas que se han salido de la sala
        //client.broadcast.to(exitUsuario.salas).emit('msgEnterExit', createMessage('Admin', `[ Disconect ] El usuario ${exitUsuario.nombre} ha salido de la sala`));
        //client.broadcast.to(exitUsuario.salas).emit('listaUsuarios', usuario.getPersonasSalas(exitUsuario.salas));
    });

    client.on('usuarioDeslogeado', () => {
        let logoutUsuario = usuario.delPersona(idUsuario);
        client.broadcast.emit('msgEnterExit', {usuario: 'Admin', mensaje: ` [ Logout ] El usuario ${logoutUsuario.nombre} ha cerrado sesion`});
        client.broadcast.emit('listaUsuarios', usuario.getPersonas());
    });

})