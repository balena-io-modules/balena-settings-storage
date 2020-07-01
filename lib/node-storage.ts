/*
Copyright 2020 Balena Ltd.

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

import { promises as fs } from 'fs';
import * as path from 'path';
import { StorageLike } from './local-storage';

export class NodeStorage implements StorageLike {
	private initialized = false;
	constructor(private dataDirectory: string) {}

	public async init() {
		if (this.initialized) {
			return;
		}
		this.initialized = true;
		try {
			await fs.mkdir(this.dataDirectory);
		} catch {
			// ignore if it already exists
		}
	}

	private getPath(key: string): string {
		return path.join(this.dataDirectory, encodeURIComponent(key));
	}
	public async clear() {
		try {
			await Promise.all(
				(await fs.readdir(this.dataDirectory)).map(async (f) => {
					f = path.join(this.dataDirectory, f);
					try {
						if ((await fs.stat(f)).isDirectory()) {
							await fs.rmdir(f);
						} else {
							await fs.unlink(f);
						}
					} catch {
						// ignore
					}
				}),
			);
		} catch {
			// ignore
		}
	}
	public async getItem(key: string) {
		try {
			return await fs.readFile(this.getPath(key), 'utf8');
		} catch {
			return null;
		}
	}
	public async setItem(key: string, data: string) {
		await this.init();
		await fs.writeFile(this.getPath(key), data, 'utf8');
	}
	public async removeItem(key: string) {
		try {
			await fs.unlink(this.getPath(key));
		} catch (e) {
			// ignore
		}
	}
}
