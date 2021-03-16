const express = require('express');

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    const app = express();

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(config.port, () => {
      console.log(`Node listening at http://localhost:${config.port}`);
      resolve({
        port: `http://localhost:${config.port}`,
        app: app
      });
    });
  });
}
