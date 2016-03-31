var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index', {env: process.env});
};

exports.signupUserForm = function(req, res) {
  res.render('signup', {env: process.env});
};

exports.loginUserForm = function(req, res) {
  res.render('login', {env: process.env});
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login', {env: process.env});
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(err, link) {
    if (link) {
      console.log('sending the user this link info: ', link);
      res.send(200, link);
    } else {
      console.log(link);
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        
        newLink.save(function(err, data) {
          res.send(200, newLink);
        });
      });

    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if (user) {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });     

    } else {
      res.redirect('/login');
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if (!user) {
      // create new user in db
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.save(function(err, data) {
        res.redirect('/');
      });

    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  // create a new link using passed in code on request
  // see if it exists in db
      // if it doesn't exist, redirect to /
      // if it does, increment link visits, save it, redirect to url

  Link.findOne({code: req.params[0]}, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {

      link.update({visits: link.visits + 1}, function(err, data) {
        if (err) {
          console.log('Error attempting to update link: ' + err);
        } else {
          res.redirect(link.url);
        }
      });
    }
  });
};