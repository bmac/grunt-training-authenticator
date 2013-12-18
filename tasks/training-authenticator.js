/*
 * grunt-reporter
 * https://github.com/bmac/grunt-reporter
 *
 * Copyright (c) 2013 bmac
 * Licensed under the MIT license.
 */

'use strict';

var prompt = require('prompt'),
    Q = require('q'),
    fs = require('fs'),
    _ = require('lodash'),
    request = require('superagent'),
    globule = require('globule'),
    readJson = require('read-package-json');

function getUrl(options, prop) {
  var propPath = options[prop],
      domain = options.domain,
      url = _.contains(propPath, '://') ? propPath : domain + propPath;
  return url;
}

function versionCheck(options) {
  var url = getUrl(options, 'versionCheckPath');
  var packagePath = __dirname + '../package.json';
  return Q.nfcall(readJson, packagePath).then(function(pkg) {
    return Q.ninvoke(request.get(url)
                     .query({ version: pkg.version }), 'end')
      .then(function(res) {
        if (res.status === 412) {
          throw new Error(res.txt);
        }
        if (res.status !== 200) {
          throw new Error('grunt-training-authenticator is not supported by', options.domain);
        }
        return 200;
      });
  });
}

function readToken(options) {
  return Q.ninvoke(fs, 'readFile', options.tokenFile, 'utf8');
}

function validateToken(token, options) {
  var url = getUrl(options, 'versionCheckPath');
  return Q.ninvoke(request.get(url)
                     .query({ token: token }), 'end')
    .then(function(res) {
      if (res.status !== 200) {
        throw new Error('invalid token');
      }
    }).fail(function(err) {
      // delete the invalid token file while preserving the rejected
      // promise
      return Q.ninvoke(fs, 'unlink', options.tokenFile).then(function() {
        throw err;
      });
    });
}



function writeTokenToFile(token, fileName) {
  return Q.ninvoke(fs, 'writeFile', fileName, token).then(function() {
    return token;
  });
};

function requestNewToken(options) {
  var schema = {
    properties: {
      username: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        hidden: true
      }
    }
  };
  prompt.start();
  return Q.ninvoke(prompt, 'get', schema).then(function(arg) {
    var url = getUrl(options, 'requestTokenPath');
    return Q.ninvoke(request.post(url)
                     .send({
                       username: arg.username,
                       password: arg.password,
                       grant_type: 'password'
                     }), 'end');
  }).then(function(arg) {
    if (arg.status !== 200) {
      throw arg.text;
    }
    return arg.body.access_token.token;
  }).then(function(token) {
    return writeTokenToFile(token, options.fileName);
  });
}

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('training-authenticator', 'The best Grunt plugin ever.', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      tokenFile: '.accessToken',
      domain: 'http://www.tophat.io',
      requestTokenPath: '/api/v1/oauth/token',
      validateTokenPath: '/api/v1/token/validate',
      versionCheckPath: '/api/v1/versionCheck'
    });

    // Find local auth token.
    // If it does not exist request username and password
    // request and store new auth token.

    var promise = versionCheck(options);

    promise.then(function() {
      var tokenPromise = readToken(options);

      return tokenPromise.then(function(token) {
        return validateToken(token, options);
      }).then(null, function() {
        return requestNewToken(options);
      });
    }).then(function() {
      done();
    }, function(error) {
      done(error);
    });
  });
};
