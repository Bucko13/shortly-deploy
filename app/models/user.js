var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('hello from inside comparePassword!');
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);


userSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  // hash the password along with our new salt
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

/*
 db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});
*/
//change again and asdf
module.exports = User;
