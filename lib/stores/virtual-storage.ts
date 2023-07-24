import type { StorageFactory } from '../types';

export const createStore: StorageFactory = () => {
	let _store: { [key: string]: string } = Object.create(null);

	return {
		getItem(key: string) {
			if (_store.hasOwnProperty(key)) {
				return _store[key];
			} else {
				return null;
			}
		},
		setItem(key: string, value: string) {
			_store[key] = value;
		},
		removeItem(key: string) {
			delete _store[key];
		},
		clear() {
			_store = {};
		},
	};
};
