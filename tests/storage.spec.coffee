m = require('mochainon')
path = require('path')
getLocalStorage = require('../lib/local-storage')
getStorage = require('../lib/storage')

IS_BROWSER = window?

dataDirectory = null
if not IS_BROWSER
	fs = require('fs')
	settings = require('resin-settings-client')
	dataDirectory = settings.get('dataDirectory')

localStorage = getLocalStorage(dataDirectory)
storage = getStorage({ dataDirectory })

describe 'Storage:', ->

	describe 'given numbers', ->

		it 'should be able to save a float number', ->
			storage.set('pi', 3.14).then ->
				m.chai.expect(storage.get('pi')).to.eventually.equal(3.14)
				storage.remove('pi')

		it 'should be able to save an integer number', ->
			storage.set('age', 34).then ->
				m.chai.expect(storage.get('age')).to.eventually.equal(34)
				storage.remove('age')

		it 'should be able to save a string number containin numbers as a string', ->
			storage.set('pi', 'pi=3.14').then ->
				m.chai.expect(storage.get('pi')).to.eventually.equal('pi=3.14')
				storage.remove('pi')

	describe 'given objects', ->

		it 'should be able to save a plain object', ->
			storage.set('pi', value: 3.14).then ->
				m.chai.expect(storage.get('pi')).to.eventually.become(value: 3.14)
				storage.remove('pi')

		it 'should be able to save an empty object', ->
			storage.set('empty', {}).then ->
				m.chai.expect(storage.get('empty')).to.eventually.become({})
				storage.remove('empty')

	describe '.set()', ->

		describe 'given a key does not exist', ->

			beforeEach ->
				storage.remove('foobar')

			it 'should be able to set a value', ->
				m.chai.expect(storage.get('foobar')).to.eventually.be.undefined
				storage.set('foobar', 'Hello').then ->
					m.chai.expect(storage.get('foobar')).to.eventually.equal('Hello')
					storage.remove('foobar')

		describe 'given a key already exist', ->

			beforeEach ->
				storage.set('foobar', 'Hello')

			afterEach ->
				storage.remove('foobar')

			it 'should be able to change the value', ->
				m.chai.expect(storage.get('foobar')).to.eventually.equal('Hello')
				storage.set('foobar', 'World').then ->
					m.chai.expect(storage.get('foobar')).to.eventually.equal('World')

	describe '.get()', ->

		describe 'given a key does not exist', ->

			beforeEach ->
				storage.remove('foobar')

			it 'should eventually be undefined', ->
				m.chai.expect(storage.get('foobar')).to.eventually.be.undefined

		describe 'given a key already exist', ->

			beforeEach ->
				storage.set('foobar', 'Hello')

			afterEach ->
				storage.remove('foobar')

			it 'should eventually be the value', ->
				m.chai.expect(storage.get('foobar')).to.eventually.equal('Hello')

		describe 'given getItem throws an error', ->

			beforeEach ->
				@getItemStub = m.sinon.stub(localStorage, 'getItem')
				@getItemStub.throws(new Error('ENOENT'))

			afterEach ->
				@getItemStub.restore()

			it 'should eventually be undefined', ->
				m.chai.expect(storage.get('foobar')).to.eventually.be.undefined

		describe 'given an externally saved value', ->

			# this test is node-specific
			return if IS_BROWSER

			beforeEach ->
				@path = path.join(dataDirectory, 'foo')
				fs.writeFileSync(@path, 'hello world')

			afterEach ->
				fs.unlinkSync(@path)

			it 'should be able to read back', ->
				m.chai.expect(storage.get('foo')).to.eventually.equal('hello world')

	describe '.has()', ->

		describe 'given a key does not exist', ->

			beforeEach ->
				storage.remove('foobar')

			it 'should eventually be false', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.false

		describe 'given a key already exist', ->

			beforeEach ->
				storage.set('foobar', 'Hello')

			afterEach ->
				storage.remove('foobar')

			it 'should eventually be true', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.true

	describe '.remove()', ->

		describe 'given a key does not exist', ->

			beforeEach ->
				storage.remove('foobar')

			it 'should do nothing', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.false
				storage.remove('foobar').then ->
					m.chai.expect(storage.has('foobar')).to.eventually.be.false

		describe 'given a key already exist', ->

			beforeEach ->
				storage.set('foobar', 'Hello')

			afterEach ->
				storage.remove('foobar')

			it 'should remove the key', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.true
				storage.remove('foobar').then ->
					m.chai.expect(storage.has('foobar')).to.eventually.be.false
