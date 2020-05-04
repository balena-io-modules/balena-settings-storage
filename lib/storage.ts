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

import * as Promise from 'bluebird';
import getLocalStorage = require('./local-storage');
import { BalenaSettingsStorage } from './types';

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
 * const storage = require('balena-settings-storage')({
 * 	dataDirectory: '/opt/cache/balena'
 * })
 */
const getStorage = ({
	dataDirectory,
}: { dataDirectory?: string } = {}): BalenaSettingsStorage => {
	const localStorage = getLocalStorage(dataDirectory);

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
	const set = (name: string, value: any) =>
		Promise.try(() => {
			if (typeof value !== 'string') {
				value = JSON.stringify(value);
			}
			return localStorage.setItem(name, value);
		});

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
	const get = (name: string): Promise<string | number | object | undefined> =>
		Promise.try(() => {
			// Run `node-localstorage` constructor to update
			// internal cache of saved files.
			// Without this, external changes to the data
			// directory (with `fs` for example) will not
			// be detected by `node-localstorage`.
			if (typeof localStorage._init === 'function') {
				localStorage._init();
			}

			const result = localStorage.getItem(name);

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
		}).catchReturn(undefined);

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
	const has = (name: string) => get(name).then(value => value != null);

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
	const remove = (name: string) =>
		Promise.try(() => localStorage.removeItem(name));

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
	const clear = () => Promise.try(() => localStorage.clear());

	return { set, get, has, remove, clear };
};

export = getStorage;
