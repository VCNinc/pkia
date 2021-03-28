const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
const trs = require('trs-js');
const AWS = require('aws-sdk');
const exec = require('child_process').exec;

openpgp.config.show_version = false;
openpgp.config.show_comment = false;

var instance_id = -1;
var experiment_id = "test";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));

var received = '';

app.post('/sns', (req, res) => {
  res.sendStatus(200);
  if(req.body.Type === "SubscriptionConfirmation") {
    axios.get(req.body.SubscribeURL);
  } else if (req.body.Type === "Notification") {
    // const message = JSON.parse(req.body.Message);
    const message = req.body.Message;
    if (message === "stage1") {
      broadcast('hello from instance ' + instance_id);
    } else if (message === "stage2") {
      writeToS3(received);
    } else {
      received.push(message + "\n");
    }
  }
});

app.get('/hello', (req, res) => {
  res.send("instance id: " + instance_id);
});

var server = app.listen(80, async () => {
  instance_id = (await axios.get('http://169.254.169.254/latest/meta-data/ami-launch-index')).data;
});

async function writeToS3(data) {
  return await new AWS.S3({apiVersion: '2006-03-01'}).putObject({
    Body: data,
    Bucket: "pkia-results",
    Key: experiment_id + '/' + instance_id
  }).promise();
}

async function broadcast(data) {
  return await new AWS.SNS({apiVersion: '2010-03-31'}).publish({
    Message: data,
    TopicArn: 'arn:aws:sns:us-east-2:295064964666:covert-channel'
  }).promise();
}
