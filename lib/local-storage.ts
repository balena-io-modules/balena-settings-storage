/*
Copyright 2016-17 Balena

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const prefixed = (key: string) => `balena-${key}`;

const createVirtualStore = () => {
	let _store: { [key: string]: string } = {};

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
		}
	};
};

type StorageType = 'localStorage' | 'sessionStorage';

// Inspired by https://github.com/gsklee/ngStorage
const isStorageSupported = ($window: Window, storageType: StorageType) => {
	// Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
	// when accessing window.localStorage. This happens before you try to do anything with it. Catch
	// that error and allow execution to continue.

	// fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
	// when "Block cookies": "Always block" is turned on
	let storage;

	try {
		storage = $window[storageType];
	} catch (err) {
		return false;
	}

	let supported;
	// When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage and sessionStorage
	// is available, but trying to call .setItem throws an exception below:
	// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
	const key = `__${Math.round(Math.random() * 1e7)}`;
	try {
		storage.setItem(key, key);
		supported = storage.getItem(key) === key;
		storage.removeItem(key);
	} catch (err) {
		return false;
	}

	return supported;
};

interface StorageLike {
	_init?: () => void;
	clear(): void;
	getItem(key: string): string | null;
	setItem(key: string, data: string): void;
	removeItem(key: string): void;
}

let createStorage: (dataDirectory?: string) => StorageLike;

if (typeof window !== 'undefined') {
	if (isStorageSupported(window, 'localStorage')) {
		createStorage = () => ({
			getItem(key: string) {
				return localStorage.getItem(prefixed(key));
			},
			setItem(key: string, value: string) {
				return localStorage.setItem(prefixed(key), value);
			},
			removeItem(key: string) {
				return localStorage.removeItem(prefixed(key));
			},
			clear() {
				return localStorage.clear();
			}
		});
	} else {
		createStorage = createVirtualStore;
	}
} else {
	// Fallback to filesystem based storage if not in the browser.
	// tslint:disable-next-line no-var-requires
	const { LocalStorage } = require('node-localstorage');
	createStorage = (dataDirectory: string) =>
		// Set infinite quota
		new LocalStorage(dataDirectory, Infinity);
}

export = createStorage;
