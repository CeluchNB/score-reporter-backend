/* eslint-disable no-console */
const app = require('./app');

const port = process.env.PORT;

app.listen(port, (error) => {
  if (error) return console.log('We got an error');

  return console.log(`We are listening on port: ${port}`);
});
