const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

//Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json'); 
const { options } = require('../helpers');
const swaggerSpec = swaggerJSDoc(options);


class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            archivos:   '/api/archivos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
            imagenes:   '/api/imagenes',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        //this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    }

    routes() {
        
        this.app.use( this.paths.auth,     require('../routes/auth'));
        this.app.use( this.paths.buscar,   require('../routes/buscar'));
        this.app.use( this.paths.archivos, require('../routes/archivos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.uploads,  require('../routes/uploads'));
        this.app.use( this.paths.imagenes, require('../routes/imagenes'));
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}


module.exports = Server;
