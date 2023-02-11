var https = require('https');
import 'dotenv/config';

export default {
  // getRouterMapGoogle(origin, destination, callback) {
  //   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.API_KEY}`;

  //   request(url, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var data = JSON.parse(body);
  //       callback(data.routes[0]);
  //     }
  //   });
  // },

  async getRoute(origin, destination, mode) {
    return new Promise((resolve, reject) => {
      var options = {
        host: 'maps.googleapis.com',
        path:
          '/maps/api/directions/json?origin=' +
          encodeURIComponent(origin) +
          '&destination=' +
          encodeURIComponent(destination) +
          '&mode=' +
          encodeURIComponent(mode) +
          '&key=' +
          process.env.API_KEY,
      };

      https.get(options, function (response) {
        var body = '';
        response.on('data', function (d) {
          body += d;
        });
        response.on('end', function () {
          try {
            var data = JSON.parse(body);
            resolve(data.routes[0].legs[0]);
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  },

  // getRoute(origin, destination, mode, callback) {
  //   const options = {
  //     host: 'maps.googleapis.com',
  //     // path: `/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.API_KEY}`,
  //     path:
  //       '/maps/api/directions/json?origin=' +
  //       encodeURIComponent(origin) +
  //       '&destination=' +
  //       encodeURIComponent(destination) +
  //       '&mode=' +
  //       encodeURIComponent(mode) +
  //       '&key=' +
  //       process.env.API_KEY,
  //   };

  //   https.get(options, function (response) {
  //     var body = '';
  //     response.on('data', function (d) {
  //       body += d;
  //     });
  //     response.on('end', function () {
  //       var data = JSON.parse(body);
  //       const route = data.routes[0];
  //       return route;
  //       // callback(data.routes[0]);
  //     });
  //   });
  // },
};
