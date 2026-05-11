const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Konfigurasi dasar Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SantaiStudy API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk platform asisten belajar SantaiStudy. Menggabungkan AI Task Breaker, Mood Suggestion, dan OCR Document Extraction.',
      contact: {
        name: 'Backend Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server (Node.js)',
      },
    ],
  },
  // Memberitahu Swagger di mana letak file route yang berisi anotasi dokumentasi
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
