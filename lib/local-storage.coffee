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

if localStorage?
	module.exports = ->
		getItem: (key) -> localStorage.getItem(prefixed(key))
		setItem: (key, value) -> localStorage.setItem(prefixed(key), value)
		removeItem: (key) -> localStorage.removeItem(prefixed(key))
		clear: -> localStorage.clear()

else
	# Fallback to filesystem based storage if not in the browser.
	{ LocalStorage } = require('node-localstorage')
	module.exports = (dataDirectory) ->
		# Set infinite quota
		new LocalStorage(dataDirectory, Infinity)
