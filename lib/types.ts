/* TODO:
because we're using `export =` style exports (for the sake of backward-compatibility)
the main module cannot export anything else.
For that matter we have to keep this definition in a separate module
to make it consumable by the downstream TS projects.
*/

export interface BalenaSettingsStorage {
	set: (name: string, value: any) => Promise<void>;
	get: (name: string) => Promise<string | number | object | undefined>;
	has: (name: string) => Promise<boolean>;
	remove: (name: string) => Promise<void>;
	clear: () => Promise<void>;
}
