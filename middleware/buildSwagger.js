const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

module.exports = async function buildSwagger (app, port, routes) {
    const swaggerOptions = {
      info: {
        title: 'Ecoloop-back',
        version: '1.0.0',
        description: 'Ecoloops 2nd Stage: Full-Stack Engineer',
      },
      swaggerDefinition: {
        openapi: '3.0.0',
        servers: [
          {
            url: `http://localhost:${port}`,
          },
        ],
      },
      apis: routes,
    };

    const outputFile = path.resolve(__dirname, '../swagger/swagger_output.json');
    await swaggerAutogen(outputFile, routes, swaggerOptions);
    const swaggerFile = require(outputFile);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
}