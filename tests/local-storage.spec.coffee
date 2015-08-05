m = require('mochainon')
localStorage = require('../lib/local-storage')

describe 'Local Storage:', ->

	it 'should expose a function called getItem()', ->
		m.chai.expect(localStorage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called setItem()', ->
		m.chai.expect(localStorage.setItem).to.be.an.instanceof(Function)

	it 'should expose a function called removeItem()', ->
		m.chai.expect(localStorage.removeItem).to.be.an.instanceof(Function)
