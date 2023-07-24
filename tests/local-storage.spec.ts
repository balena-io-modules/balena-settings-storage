import { expect } from 'chai';

import { createStorage } from '../lib/stores/local-storage';

const IS_BROWSER = typeof window !== 'undefined';

let dataDirectory: string | undefined;
if (!IS_BROWSER) {
	const settings =
		// tslint:disable-next-line no-var-requires
		require('balena-settings-client') as typeof import('balena-settings-client');
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
