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

prefixed = (key) -> 'resin-' + key

createVirtualStore = ->
	_store = {}

	getItem: (key) ->
		return if _store.hasOwnProperty(key) then _store[key] else null
	setItem: (key, value) ->
		_store[key] = value
		return
	removeItem: (key) ->
		delete _store[key]
		return
	clear: ->
		_store = {}
		return



# Inspired by https://github.com/gsklee/ngStorage
isStorageSupported = ($window, storageType) ->
	# Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
	# when accessing window.localStorage. This happens before you try to do anything with it. Catch
	# that error and allow execution to continue.

	# fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
	# when "Block cookies": "Always block" is turned on
	try
		supported = $window[storageType]
	catch err
		supported = false

	# When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
	# is available, but trying to call .setItem throws an exception below:
	# "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
	if supported
		key = '__' + Math.round(Math.random() * 1e7)
		try
			$window[storageType].setItem(key, key)
			supported = $window[storageType].getItem(key) is key
			$window[storageType].removeItem(key, key)
		catch err
			supported = false

	return supported

noop = ->

if window?
	if isStorageSupported(window, 'localStorage')
		module.exports = ->
			getItem: (key) -> localStorage.getItem(prefixed(key))
			setItem: (key, value) -> localStorage.setItem(prefixed(key), value)
			removeItem: (key) -> localStorage.removeItem(prefixed(key))
			clear: -> localStorage.clear()
	else
		module.exports = -> createVirtualStore()

else
	# Fallback to filesystem based storage if not in the browser.
	{ LocalStorage } = require('node-localstorage')
	module.exports = (dataDirectory) ->
		# Set infinite quota
		new LocalStorage(dataDirectory, Infinity)
