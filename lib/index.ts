import { getStorage as $getStorage } from './storage';
import type {
	BalenaSettingsStorage,
	BalenaSettingsStorageOptions,
	StorageLike,
} from './types';

export type {
	BalenaSettingsStorageOptions,
	BalenaSettingsStorage,
} from './types';

// use dynamic imports so that node apps have less files to read on startup.
const lazyImport = {
	virtual: () =>
		require('./stores/virtual-storage') as typeof import('./stores/virtual-storage'),
	local: () =>
		require('./stores/local-storage') as typeof import('./stores/local-storage'),
	node: () =>
		require('./stores/node-storage') as typeof import('./stores/node-storage'),
};

export const getStorage = (
	options: BalenaSettingsStorageOptions,
): BalenaSettingsStorage => {
	let store: StorageLike;
	if (options?.dataDirectory === false) {
		store = lazyImport.virtual().createStore();
	} else if (typeof window !== 'undefined') {
		// Even though we specify an alternative file for this in the package.json's `browser` field
		// we still need to handle the `isBrowser` case in the default file for the case that the
		// bundler doesn't support/use the `browser` field.
		const localStore = lazyImport.local();
		store = localStore.isSupported()
			? localStore.createStorage(options?.dataDirectory)
			: lazyImport.virtual().createStore(options?.dataDirectory);
	} else {
		// Fallback to filesystem based storage if not in the browser.
		store = lazyImport.node().createStorage(options?.dataDirectory);
	}
	return $getStorage(store);
};
