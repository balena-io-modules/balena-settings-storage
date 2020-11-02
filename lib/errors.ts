/**
 * @module errors
 */

import { TypedError } from 'typed-error';

export class BalenaError extends TypedError {
	public code!: string;
	public exitCode!: number;
}
BalenaError.prototype.code = 'BalenaError';
BalenaError.prototype.exitCode = 1;

/**
 * @summary Balena settings permission error
 * @class
 * @public
 *
 * @param {Error} error - usually an EACCESS error
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaSettingsPermissionError()
 */
export class BalenaSettingsPermissionError extends BalenaError {}
BalenaSettingsPermissionError.prototype.code = 'BalenaSettingsPermissionError';
