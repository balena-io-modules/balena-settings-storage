m = require('mochainon')
getLocalStorage = require('../lib/local-storage')

IS_BROWSER = window?

dataDirectory = null
if not IS_BROWSER
	settings = require('resin-settings-client')
	dataDirectory = settings.get('dataDirectory')

localStorage = getLocalStorage(dataDirectory)

describe 'Local Storage:', ->

	it 'should expose a function called getItem()', ->
		m.chai.expect(localStorage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called setItem()', ->
		m.chai.expect(localStorage.setItem).to.be.an.instanceof(Function)

	it 'should expose a function called removeItem()', ->
		m.chai.expect(localStorage.removeItem).to.be.an.instanceof(Function)
