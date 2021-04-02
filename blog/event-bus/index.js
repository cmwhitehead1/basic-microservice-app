const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


// This events array is used to hold all the events.
// Useful for when a service goes down and needs to get a list of all events that it missed.
const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-clusterip-service:4000/events', event); // using the kubernetes cluster ip for routering..
  axios.post('http://comments-clusterip-service:4001/events', event);
  axios.post('http://query-clusterip-service:4002/events', event);
  axios.post('http://moderation-clusterip-service:4003/events', event);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
  console.log('v4');
});
