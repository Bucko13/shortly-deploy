var app = require('./server-config.js');

var port = 4568;

var env = app.get('env');

app.listen(port);

console.log('Server now listening on port ' + port);
console.log('environment =  ' + app.get('env'));
