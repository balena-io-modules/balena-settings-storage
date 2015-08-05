m = require('mochainon')
localStorage = require('../lib/local-storage')
storage = require('../lib/storage')

describe 'Storage:', ->

	describe 'given numbers', ->

		it 'should be able to save a float number', (done) ->
			storage.set('pi', 3.14).then ->
				m.chai.expect(storage.get('pi')).to.eventually.equal(3.14)
				storage.remove('pi')
			.nodeify(done)

		it 'should be able to save an integer number', (done) ->
			storage.set('age', 34).then ->
				m.chai.expect(storage.get('age')).to.eventually.equal(34)
				storage.remove('age')
			.nodeify(done)

		it 'should be able to save a string number containin numbers as a string', (done) ->
			storage.set('pi', 'pi=3.14').then ->
				m.chai.expect(storage.get('pi')).to.eventually.equal('pi=3.14')
				storage.remove('pi')
			.nodeify(done)

	describe 'given objects', ->

		it 'should be able to save a plain object', (done) ->
			storage.set('pi', value: 3.14).then ->
				m.chai.expect(storage.get('pi')).to.eventually.become(value: 3.14)
				storage.remove('pi')
			.nodeify(done)

		it 'should be able to save an empty object', (done) ->
			storage.set('empty', {}).then ->
				m.chai.expect(storage.get('empty')).to.eventually.become({})
				storage.remove('empty')
			.nodeify(done)

	describe '.set()', ->

		describe 'given a key does not exist', ->

			beforeEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should be able to set a value', (done) ->
				m.chai.expect(storage.get('foobar')).to.eventually.be.undefined
				storage.set('foobar', 'Hello').then ->
					m.chai.expect(storage.get('foobar')).to.eventually.equal('Hello')
					storage.remove('foobar')
				.nodeify(done)

		describe 'given a key already exist', ->

			beforeEach (done) ->
				storage.set('foobar', 'Hello').nodeify(done)

			afterEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should be able to change the value', (done) ->
				m.chai.expect(storage.get('foobar')).to.eventually.equal('Hello')
				storage.set('foobar', 'World').then ->
					m.chai.expect(storage.get('foobar')).to.eventually.equal('World')
				.nodeify(done)

	describe '.get()', ->

		describe 'given a key does not exist', ->

			beforeEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should eventually be undefined', ->
				m.chai.expect(storage.get('foobar')).to.eventually.be.undefined

		describe 'given a key already exist', ->

			beforeEach (done) ->
				storage.set('foobar', 'Hello').nodeify(done)

			afterEach (done) ->
				storage.remove('foobar').nodeify(done)

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

	describe '.has()', ->

		describe 'given a key does not exist', ->

			beforeEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should eventually be false', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.false

		describe 'given a key already exist', ->

			beforeEach (done) ->
				storage.set('foobar', 'Hello').nodeify(done)

			afterEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should eventually be true', ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.true

	describe '.remove()', ->

		describe 'given a key does not exist', ->

			beforeEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should do nothing', (done) ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.false
				storage.remove('foobar').then ->
					m.chai.expect(storage.has('foobar')).to.eventually.be.false
				.nodeify(done)

		describe 'given a key already exist', ->

			beforeEach (done) ->
				storage.set('foobar', 'Hello').nodeify(done)

			afterEach (done) ->
				storage.remove('foobar').nodeify(done)

			it 'should remove the key', (done) ->
				m.chai.expect(storage.has('foobar')).to.eventually.be.true
				storage.remove('foobar').then ->
					m.chai.expect(storage.has('foobar')).to.eventually.be.false
				.nodeify(done)
