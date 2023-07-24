export interface BalenaSettingsStorage {
	set: (name: string, value: any) => Promise<void>;
	get: (name: string) => Promise<string | number | object | undefined>;
	has: (name: string) => Promise<boolean>;
	remove: (name: string) => Promise<void>;
	clear: () => Promise<void>;
}

export interface StorageLike {
	clear(): PromiseLike<void> | void;
	getItem(key: string): PromiseLike<string | null> | string | null;
	setItem(key: string, data: string): PromiseLike<void> | void;
	removeItem(key: string): PromiseLike<void> | void;
}

export type StorageFactory = (dataDirectory?: string) => StorageLike;
