const path = require('path');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'API ALUXION',
      version: '1.0.0',
    },
    servers:[
      {
          url:"http://localhost:8090"
      }
    ]
  };
  
  const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: [ `${ path.join(__dirname,"./routes/*.js")}`]
  };
  


module.exports = {
    options
}

