import { expect } from 'chai';
import * as BalenaSettingsClientModule from 'balena-settings-client';

import { createStorage } from '../lib/local-storage';

const IS_BROWSER = typeof window !== 'undefined';

let dataDirectory: string | undefined;
if (!IS_BROWSER) {
	// tslint:disable-next-line no-var-requires
	const settings: typeof BalenaSettingsClientModule = require('balena-settings-client');
	dataDirectory = settings.get<string>('dataDirectory');
}

const localStorage = createStorage(dataDirectory);

describe('Local Storage:', () => {
	it('should expose a function called getItem()', () =>
		expect(localStorage.getItem).to.be.an.instanceof(Function));

	it('should expose a function called setItem()', () =>
		expect(localStorage.setItem).to.be.an.instanceof(Function));

	it('should expose a function called removeItem()', () =>
		expect(localStorage.removeItem).to.be.an.instanceof(Function));
});
