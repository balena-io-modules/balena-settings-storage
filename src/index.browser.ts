import * as localStore from './stores/local-storage';
import * as virtualStore from './stores/virtual-storage';
import { getStorage as $getStorage } from './storage';
import type {
	BalenaSettingsStorageOptions,
	BalenaSettingsStorage,
} from './types';

export type {
	BalenaSettingsStorageOptions,
	BalenaSettingsStorage,
} from './types';

export const getStorage = (
	options: BalenaSettingsStorageOptions,
): BalenaSettingsStorage => {
	const store =
		options?.dataDirectory === false || !localStore.isSupported()
			? virtualStore.createStore()
			: localStore.createStorage(options?.dataDirectory);
	return $getStorage(store);
};
