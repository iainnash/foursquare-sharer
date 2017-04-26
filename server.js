// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var config = {
  'secrets': {
    'clientId': process.env.FOURSQUARE_CLIENT_ID,
    'clientSecret': process.env.FOURSQUARE_CLIENT_SECRET,
    'redirectUrl': process.env.REDIRECT_URL,
  },
};

var foursquare = require('node-foursquare')(config);

app.get('/where', function(req, res) {
  foursquare.Users.getCheckins(null, {limit: 1}, process.env.ACCESS_TOKEN, function(error, data) {
    const location = data.checkins.items[0].venue.location;
    var cat;
    if (data.checkins.items[0].venue.categories) {
      cat = data.checkins.items[0].venue.categories[0].name;
    }
    
    res.send({
      city: location.city,
      country: location.country,
      cat: cat,
      lat: location.lat,
      lng: location.lng,
    });
  });
})

app.get('/backend/login', function(req, res) {
  res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
  res.end();
});


app.get('/4sq_oauth', function (req, res) {
  foursquare.getAccessToken({
    code: req.query.code
  }, function (error, accessToken) {
    if (error) {
      res.send('An error was thrown: ' + error.message);
    } else {
      console.log('has accessToken', accessToken);
    }
  });
});


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
