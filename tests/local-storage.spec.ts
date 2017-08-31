import * as m from 'mochainon';
import * as ResinSettingsClientModule from 'resin-settings-client';

import getLocalStorage = require('../lib/local-storage');

const IS_BROWSER = typeof window !== 'undefined';

let dataDirectory: string | undefined;
if (!IS_BROWSER) {
	// tslint:disable-next-line no-var-requires
	const settings: typeof ResinSettingsClientModule = require('resin-settings-client');
	dataDirectory = settings.get<string>('dataDirectory');
}

const localStorage = getLocalStorage(dataDirectory);

describe('Local Storage:', () => {
	it('should expose a function called getItem()', () =>
		m.chai.expect(localStorage.getItem).to.be.an.instanceof(Function));

	it('should expose a function called setItem()', () =>
		m.chai.expect(localStorage.setItem).to.be.an.instanceof(Function));

	it('should expose a function called removeItem()', () =>
		m.chai.expect(localStorage.removeItem).to.be.an.instanceof(Function));
});
