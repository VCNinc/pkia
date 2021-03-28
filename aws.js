const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
const trs = require('trs-js');
const aws = require('aws-sdk');
const exec = require('child_process').exec;

openpgp.config.show_version = false;
openpgp.config.show_comment = false;

var instance_id = -1;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));

app.post('/sns', (req, res) => {
  res.sendStatus(200);
  if(req.body.Type === "SubscriptionConfirmation") {
    axios.get(req.body.SubscribeURL);
  }
});

app.get('/hello', (req, res) => {
  res.send("instance id: " + instance_id);
});

var server = app.listen(80, async () => {
  instance_id = (await axios.get('http://169.254.169.254/latest/meta-data/ami-launch-index')).data;
});
