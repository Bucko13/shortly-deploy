var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
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

module.exports = User;
