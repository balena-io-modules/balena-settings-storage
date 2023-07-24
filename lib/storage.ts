/*
Copyright 2016 Balena

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

/**
 * @module storage
 */

import { BalenaSettingsStorage, StorageLike } from './types';
import { BalenaSettingsPermissionError } from 'balena-errors';

/**
 * @summary Get an instance of storage module
 * @function
 * @static
 * @public
 *
 * @param {Object?} options - options
 * @param {string?} options.dataDirectory - the directory to use for storage in Node.js. Ignored in the browser.
 *
 * @return {storage}
 * @example
 * // with es6 imports
 * import { getStorage } from 'balena-settings-storage';
 * // or with node require
 * const { getStorage } = require('balena-settings-storage');
 *
 * const storage = getStorage({
 * 	dataDirectory: '/opt/cache/balena'
 * });
 */
export const getStorage = (store: StorageLike): BalenaSettingsStorage => {
	/**
	 * @summary Set a value
	 * @function
	 * @public
	 *
	 * @param {String} name - name
	 * @param {*} value - value
	 *
	 * @return {Promise}
	 *
	 * @example
	 * storage.set('token', '1234')
	 */
	const set = async (name: string, value: any) => {
		if (typeof value !== 'string') {
			value = JSON.stringify(value);
		}
		return store.setItem(name, value);
	};

	/**
	 * @summary Get a value
	 * @function
	 * @public
	 *
	 * @param {String} name - name
	 *
	 * @return {Promise<*>} value or undefined
	 *
	 * @example
	 * storage.get('token').then((token) => {
	 * 	console.log(token)
	 * });
	 */
	const get = async (
		name: string,
	): Promise<string | number | object | undefined> => {
		try {
			const result = await store.getItem(name);

			if (result == null) {
				return undefined;
			}

			if (/^-?\d+\.?\d*$/.test(result)) {
				return parseFloat(result);
			}

			try {
				return JSON.parse(result);
			} catch (error) {
				// do nothing
			}

			return result;
		} catch (err: any) {
			if (err.code === 'EACCES') {
				throw new BalenaSettingsPermissionError(err);
			}

			return undefined;
		}
	};

	/**
	 * @summary Check if the value exists
	 * @function
	 * @public
	 *
	 * @param {String} name - name
	 *
	 * @return {Promise<Boolean>} has value
	 *
	 * @example
	 * storage.has('token').then((hasToken) => {
	 * 	if (hasToken) {
	 * 		console.log('Yes')
	 * 	} else {
	 * 		console.log('No')
	 * });
	 */
	const has = async (name: string) => {
		const value = await get(name);
		return value != null;
	};

	/**
	 * @summary Remove a value
	 * @function
	 * @public
	 *
	 * @param {String} name - name
	 *
	 * @return {Promise}
	 *
	 * @example
	 * storage.remove('token')
	 */
	const remove = async (name: string) => store.removeItem(name);

	/**
	 * @summary Remove all values
	 * @function
	 * @public
	 *
	 *
	 * @return {Promise}
	 *
	 * @example
	 * storage.clear()
	 */
	const clear = async () => store.clear();

	return { set, get, has, remove, clear };
};
