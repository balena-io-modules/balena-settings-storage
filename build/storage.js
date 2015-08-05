
/*
The MIT License

Copyright (c) 2015 Resin.io, Inc. https://resin.io.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
 * @module storage
 */
var Promise, localStorage, _;

Promise = require('bluebird');

_ = require('lodash');

localStorage = require('./local-storage');


/**
 * @summary Set a value
 * @function
 * @public
 *
 * @param {String} name - name
 * @param {*} value - value
 *
 * @return {Promise}
 *
 * @example
 * storage.set('token', '1234')
 */

exports.set = function(name, value) {
  return Promise["try"](function() {
    if (!_.isString(value)) {
      value = JSON.stringify(value);
    }
    return localStorage.setItem(name, value);
  });
};


/**
 * @summary Get a value
 * @function
 * @public
 *
 * @param {String} name - name
 *
 * @return {Promise<*>} value or undefined
 *
 * @example
 * storage.get('token').then (token) ->
 * 	console.log(token)
 */

exports.get = function(name) {
  return Promise["try"](function() {
    var result;
    result = localStorage.getItem(name) || void 0;
    if (/^-?\d+\.?\d*$/.test(result)) {
      result = parseFloat(result);
    }
    try {
      result = JSON.parse(result);
    } catch (_error) {}
    return result;
  })["catch"](function() {
    return void 0;
  });
};


/**
 * @summary Check if a value exists
 * @function
 * @public
 *
 * @param {String} name - name
 *
 * @return {Promise<Boolean>} has value
 *
 * @example
 * storage.has('token').then (hasToken) ->
 * 	if hasToken
 * 		console.log('Yes')
 * 	else
 * 		console.log('No')
 */

exports.has = function(name) {
  return exports.get(name).then(function(value) {
    return value != null;
  });
};


/**
 * @summary Remove a value
 * @function
 * @public
 *
 * @param {String} name - name
 *
 * @return {Promise}
 *
 * @example
 * storage.remove('token')
 */

exports.remove = function(name) {
  return Promise["try"](function() {
    return localStorage.removeItem(name);
  });
};
