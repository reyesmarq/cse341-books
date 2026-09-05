import app from './app.js';

const port = process.env.PORT;

if (!port) {
  throw new Error('PORT environment variable is not defined');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
