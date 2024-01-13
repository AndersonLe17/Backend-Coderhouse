import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Ecommerce',
            version: '1.0.0',
            description: 'API to ecommerce',
        }
    },
    apis: [`${__dirname}/../../docs/*.yaml`]
};

export const swaggerSetup = swaggerJSDoc(swaggerDefinition);