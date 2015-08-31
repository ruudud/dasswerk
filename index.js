var fs = require('fs');

var express = require('express');
var morgan = require('morgan');
var getRawBody = require('raw-body');
var favicon = require('serve-favicon');
var tmplEngine = require('ejs-mate');


var config = {
  imgStore: process.env.IMAGE_STORE || './public/drawings/'
};

var app = express();
app.engine('ejs', tmplEngine);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.set('etag', false);

app.use(express.static(__dirname + '/public', { maxAge: '5d' }));
app.use('/drawing', express.static(config.imgStore, { maxAge: '5d' }));
app.use(morgan('short'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.get('/drawings', function (req, res) {
  fs.readdir(config.imgStore, function(err, files) {
    var rnd = Math.floor(Math.random() * files.length);
    console.log('[%s] Showing %s', new Date(), files[rnd]);
    res.render('drawings', { drawing: files[rnd] });
  });
});

app.post('/drawings', function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf8'
  }, function (err, string) {
    if (err) throw err;
    var base64Data = string.replace(/^data:image\/png;base64,/, '');
    var path = config.imgStore +
      Date.now() + Math.floor(Math.random() * 1000) + '.png';

    fs.writeFile(path, base64Data, 'base64', function(fdErr) {
      if (fdErr) throw fdErr;
      console.log('[%s] Saved %s', new Date(), path);
    });
    return res.status(201).end();
  });
});


var server = app.listen(process.env.PORT || 5000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('[%s] App listening at http://%s:%s', new Date(), host, port);
});

process.on('SIGINT', function() {
  console.log('[%s] Closing connections to the web service…', new Date());
  server.close();
});
