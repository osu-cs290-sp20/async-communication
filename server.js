var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var peopleData = require('./peopleData');

var app = express();
var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage');
});

app.get('/people', function (req, res, next) {
  res.status(200).render('peoplePage', {
    people: peopleData
  });
});

app.get('/people/:person', function (req, res, next) {
  var person = req.params.person.toLowerCase();
  if (peopleData[person]) {
    res.status(200).render('photoPage', peopleData[person]);
  } else {
    next();
  }
});

app.post('/people/:person/addPhoto', function (req, res, next) {
  console.log("== req.body:", req.body);
  console.log("  -- req.body.url:", req.body.url);
  console.log("  -- req.body.caption:", req.body.caption);

  var person = req.params.person.toLowerCase();
  if (peopleData[person]) {
    if (req.body && req.body.url && req.body.caption) {
      peopleData[person].photos.push({
        url: req.body.url,
        caption: req.body.caption
      });
      /*
       * Persist peopleData using fs.writeFile().
       */
      console.log("== Added a photo for", person, peopleData[person]);
      res.status(200).send("Photo successfully added");
    } else {
      res.status(400).send("This request needs a body with a url field and a caption field.")
    }
  } else {
    next();
  }
});

app.get('*', function (req, res, next) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
})
