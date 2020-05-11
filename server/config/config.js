/*
    Configuracion del entorno de desarrollo y produccion
*/

/*
	Con el add-ons de mLab que ofrede Heroku genera automaticamente
	MONGODB_URI que esta definida en las variables de configuracion de Heroku.
	
	Para ver las variables de configuracion de Heroku: heroku config

	Confugrarar las variables de configuracion desde la terminal
	heroku config:set MONGO_URI="XXXXXXX"
    heroku config:get nombre
    heroku config:unset nombre
    heroku config:set nombre="Nestor"

*/

module.exports = {
	port: process.env.PORT || 3000,
	db: process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe',
	seed: process.env.SEED || 'mi-semilla-seed-secreto-desarrollo',
	expiracion_token: process.env.EXPIRACION_TOKEN || '30d'
}