var app = require('./server-config.js');

var port = 4568;

var env = app.get('env');

app.listen(port);
