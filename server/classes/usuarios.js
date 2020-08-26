

/*
    Esta clase controlara los usuarios que han
    inciado sesion dentro de la aplicacion.

    Los usuarios que entran en la aplicacion seran
    almacenados en this.personas

    El id es el id que nos trae socket.io de los 
    usuarios conectados.
*/

class Usuarios {
    
    constructor() {
        this.personas = [];
    }

    addPersona(id, dataUsuario)
    {
        let persona = {
            id,
            ...dataUsuario
        }
        this.personas.push(persona);
        return persona;
    }

    getPersona(id)
    {
        const PersonaEncontrada = this.personas.filter( persona => {
            return persona.id == id
        })[0]; // Devuelve el primer objeto encontrado como los id son unicos siempre sera uno
        return PersonaEncontrada;
    }

    getPersonas()
    {
        return this.personas;
    }

    delPersona(id)
    {

        let personaBorrada = this.getPersona(id);

        /*
            Devuelve un nuevo arreglo con las personas que no coincide
            el id. Es decir si coincide la persona que quremos borrar ya
            no existe en this.personas.
        */
        this.personas = this.personas.filter(persona => {
            return persona.id != id
        });

        return personaBorrada;
    }

    getPersonasSalas(sala)
    {
        let personasEnSala = this.personas.filter(persona => {
            return persona.salas === sala;
        });
        return personasEnSala;
    }
}

module.exports = {
    Usuarios
}