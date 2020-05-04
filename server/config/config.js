/*
    Configuracion del entorno de desarrollo y produccion
*/

/*
	Con el add-ons de mLab que ofrede Heroku genera automaticamente
	MONGODB_URI que esta definida en las variables de configuracion de Heroku.
	Para ver las variables de configuracion de Heroku: heroku config
*/

module.exports = {
	port: process.env.PORT || 3000,
	db: process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe'
}

