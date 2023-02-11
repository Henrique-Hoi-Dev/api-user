var https = require('https');
import 'dotenv/config';

export default {
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
};
