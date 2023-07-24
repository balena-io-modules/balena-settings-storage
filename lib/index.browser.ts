import * as localStore from './stores/local-storage';
import * as virtualStore from './stores/virtual-storage';
import { getStorage as $getStorage } from './storage';
import type { BalenaSettingsStorage } from './types';

export type { BalenaSettingsStorage } from './types';

export const getStorage = (options: {
	dataDirectory?: string;
}): BalenaSettingsStorage => {
	const store = localStore.isSupported()
		? localStore.createStorage(options?.dataDirectory)
		: virtualStore.createStore(options?.dataDirectory);
	return $getStorage(store);
};
