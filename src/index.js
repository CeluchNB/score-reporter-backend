const app = require('./app');
const port = process.env.PORT;


app.listen(port, (error) => {
  if (error) return console.log('We got an error');

  console.log(`We are listening on port: ${port}`);
});
