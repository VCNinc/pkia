const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
const trs = require('trs-js');
const exec = require('child_process').exec;
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

openpgp.config.show_version = false;
openpgp.config.show_comment = false;

var instance_id = -1;
var experiment_id = "test";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));

var received = [];

app.post('/sns', (req, res) => {
  res.sendStatus(200);
  if(req.body.Type === "SubscriptionConfirmation") {
    axios.get(req.body.SubscribeURL);
  } else if (req.body.Type === "Notification") {
    var message = req.body.Message;
    if (message === "stage1") {
      broadcast({
        message: 'hello from instance ' + instance_id,
        instance_id: instance_id
      });
    } else if (message === "stage2") {
      writeToS3(experiment_id + '/out/' + instance_id + '.txt', received);
    } else {
      message = JSON.parse(message);
      message.Records.forEach((record) => {
        handleS3Record(record);
      });
    }
  }
});

app.get('/hello', (req, res) => {
  res.send("instance id: " + instance_id);
});

var server = app.listen(80, async () => {
  instance_id = (await axios.get('http://169.254.169.254/latest/meta-data/ami-launch-index')).data;
});

async function writeToS3(name, data) {
  return await new AWS.S3({apiVersion: '2006-03-01'}).putObject({
    Body: JSON.stringify(data),
    Bucket: "pkia-results",
    Key: name
  }).promise();
}

async function broadcast(data) {
  return await new AWS.Firehose({apiVersion: '2015-08-04'}).putRecord({
    Record: {Data: JSON.stringify(data) + "\n"},
    DeliveryStreamName: 'covert-channel'
  }).promise();
}

async function handleCommand(request) {
  let cmd = JSON.parse(request);
  received.push(cmd.message);
}

async function handleS3Record(record) {
  if (record.s3.bucket.name === "pkia-covert-channel" && record.eventName === "ObjectCreated:Put") {
    let data = await fetchS3Record(record.s3.object.key);
    let commands = data.split(/\r?\n/);
    commands.forEach(handleCommand);
  }
}

async function fetchS3Record(name) {
  return (await new AWS.S3({apiVersion: '2006-03-01'}).getObject({
    Bucket: "pkia-covert-channel",
    Key: name
  }).promise()).Body.toString();
}
