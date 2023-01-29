require('dotenv').config({
  path: `.env`,
});
const basicAuth = require('express-basic-auth');

const TOKEN_ENDPOINT = 'https://api.dsco.io/api/v3/oauth2/token';

const { json2xml } = require('xml-js');
const express = require('express');
const axios = require('axios');
const app = express();
const router = express.Router();

app.use(basicAuth({
  authorizer: (username, password) => {
    const userMatches = basicAuth.safeCompare(username, 'bwadmin')
    const passwordMatches = basicAuth.safeCompare(password, 'bwsecret00')
    return userMatches & passwordMatches
  }
}));


app.get('/', (req, res) => {
  res.send('authorized');
});

let port = process.env.PORT || 3001;
app.listen(port, () => console.log('running api'));

const qs = require('qs');
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const tokenData = {
  grant_type: 'client_credentials',
  client_id: process.env.DSCO_APP_ID,
  client_secret: process.env.DSCO_APP_SECRET,
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

const convertJsonToXml = (jsonObj) => {
  if (jsonObj && jsonObj !== '') {
    let xml = json2xml(jsonObj, { compact: true, spaces: 1 });
    return xml;
  }
};

//get
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
        
        app.get('/get', (req, res) => {
          app.use('api');
          let xml = convertJsonToXml(response.data);
          console.log(response.data);

          res.send(xml).then(() => {});
        });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

// //post
// axios
//   .post(TOKEN_ENDPOINT, qs.stringify(tokenData))
//   .then((response) => {
//     return response.data.access_token;
//   })
//   .then((token) => {
//     axios
//       .post('/post', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         const action = 'shipnotify';
//         const order_number = response.data.order_number;
//         const carrier = response.data.carrier;
//         const service = response.data.service;
//         const tracking_number = response.data.tracking_number;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

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
