const APP_ID = `2uq1o18ar7nqnc21sp2mpfi55i`;
const APP_SECRET = `1vplaa8oiabeah8p74ojmqpigq3u0ko1bo7d6vp5r0a55t5uh77`;
const TOKEN_ENDPOINT = 'https://api.dsco.io/api/v3/oauth2/token';
const importData = require('./data.json');
const express = require('express');
const axios = require('axios');
const port = 8080;
const app = express();

app.listen(port, () => console.log('running api'));
app.get('/', (req, res) => {
  res.send('running api');
});
const qs = require('qs');
const api = axios.create({
  baseURL: `http://localhost:8080/dsco-integration`,
});
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const tokenData = {
  grant_type: 'client_credentials',
  client_id: APP_ID,
  client_secret: APP_SECRET,
};

const getData = {
  end_date: '',
  start_date: '',
  action: 'export',
};

const postData = {
  carrier: '',
  order_number: '',
  action: 'shipnotify',
  service: '',
  tracking_number: '',
};

//test

const ordersCreatedSince = new Date('05 November 2022 14:48 UTC').toISOString();
const until = new Date('06 November 2022 14:48 UTC').toISOString();

axios
  .post(TOKEN_ENDPOINT, qs.stringify(tokenData))
  .then((response) => {
    return response.data.access_token;
  })
  .then((token) => {
    axios
      .get('https://api.dsco.io/api/v3/order/page', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ordersCreatedSince: ordersCreatedSince,
          until: until,
        },
      })
      .then((response) => {
        app.get('/test', (req, res) => {
          res.send(response.data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

// expected output: Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)
// (note: your timezone may vary)

// expected output: 2011-10-05T14:48:00.000Z

// axios
//   .get('/get-data', qs.stringify(getData))
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// axios
//   .post('/post-data', qs.stringify(postData))
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
