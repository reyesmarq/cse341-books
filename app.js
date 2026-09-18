import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './src/router.js';
import swaggerSpec from './src/swagger.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello, world!' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);

export default app;
