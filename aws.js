const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
const trs = require('trs-js');
const aws = require('aws-sdk');
const exec = require('child_process').exec;

openpgp.config.show_version = false;
openpgp.config.show_comment = false;

const app = express();
app.use(bodyParser.json());

function shutdown(callback){
    exec('shutdown -r now', function(error, stdout, stderr){ callback(stdout); });
}

app.get('/hello', (req, res) => {
  res.sendStatus(200);
});

app.post('/shutdown', (req, res) => {
  res.sendStatus(200);
  shutdown(function(output){
      console.log(output);
  });
});

var server = app.listen(config.port, () => {
  console.log('listening!');
});
