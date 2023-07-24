import * as nodeStore from './stores/node-storage';
import { getStorage as $getStorage } from './storage';
import type { BalenaSettingsStorage, StorageLike } from './types';

export type { BalenaSettingsStorage } from './types';

export const getStorage = (options: {
	dataDirectory?: string;
}): BalenaSettingsStorage => {
	let store: StorageLike;
	if (typeof window !== 'undefined') {
		// use dynamic imports so that node apps have less files to read on startup.
		const localStore =
			require('./stores/local-storage') as typeof import('./stores/local-storage');
		store = localStorage.isSupported()
			? localStore.createStorage(options?.dataDirectory)
			: (
					require('./stores/virtual-storage') as typeof import('./stores/virtual-storage')
			  ).createStore(options?.dataDirectory);
	} else {
		// Fallback to filesystem based storage if not in the browser.
		store = nodeStore.createStorage(options?.dataDirectory);
	}
	return $getStorage(store);
};
