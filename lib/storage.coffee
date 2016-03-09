###
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

###*
# @module storage
###

Promise = require('bluebird')
_ = require('lodash')
localStorage = require('./local-storage')

###*
# @summary Set a value
# @function
# @public
#
# @param {String} name - name
# @param {*} value - value
#
# @return {Promise}
#
# @example
# storage.set('token', '1234')
###
exports.set = (name, value) ->
	Promise.try ->
		if not _.isString(value)
			value = JSON.stringify(value)
		localStorage.setItem(name, value)

###*
# @summary Get a value
# @function
# @public
#
# @param {String} name - name
#
# @return {Promise<*>} value or undefined
#
# @example
# storage.get('token').then (token) ->
# 	console.log(token)
###
exports.get = (name) ->
	Promise.try ->

		# Run `node-localstorage` constructor to update
		# internal cache of saved files.
		# Without this, external changes to the data
		# directory (with `fs` for example) will not
		# be detected by `node-localstorage`.
		localStorage._init()

		result = localStorage.getItem(name) or undefined

		if /^-?\d+\.?\d*$/.test(result)
			result = parseFloat(result)

		try
			result = JSON.parse(result)

		return result

	# getItem() throws a ENOENT error in
	# NodeJS if the file doesn't exist.
	.catchReturn(undefined)

###*
# @summary Check if a value exists
# @function
# @public
#
# @param {String} name - name
#
# @return {Promise<Boolean>} has value
#
# @example
# storage.has('token').then (hasToken) ->
# 	if hasToken
# 		console.log('Yes')
# 	else
# 		console.log('No')
###
exports.has = (name) ->
	exports.get(name).then (value) ->
		return value?

###*
# @summary Remove a value
# @function
# @public
#
# @param {String} name - name
#
# @return {Promise}
#
# @example
# storage.remove('token')
###
exports.remove = (name) ->
	Promise.try ->
		localStorage.removeItem(name)
