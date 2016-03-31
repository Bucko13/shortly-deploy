var db = require('../config');
var crypto = require('crypto');


var Link = mongoose.model('Link', linkSchema);

linkSchema.pre('save', function(next) {
  var link = this;
  // only hash the password if it has been modified (or is new)
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
});
/*

var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});
*/
module.exports = Link;
