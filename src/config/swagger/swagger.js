import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'QATU',
      version: '1.0.0',
      description: 'API for managing Cozy Spot',
      contact: {
        developer: 'Aldo Ochoa Condori',
        developer: 'Diego Terrazas Sanchez',
        developer: 'Cristopher Rivas Avila',
        developer: 'Danilo Castro de la hoz',
        developer: 'Alejandro Valencia Rodriguez',
        developer: 'Jadier Manosalva Rangel',
      },
    },
    servers: [
      {
        url: 'http://localhost:3005/QatuService/v1',
        description: 'Local Server',
      },
    ],
  },
  apis: ['./src/config/swagger/swagger.yml'],
};

const specs = swaggerJSDoc(options);
export default specs;
