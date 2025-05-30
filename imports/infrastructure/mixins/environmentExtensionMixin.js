import { createLog } from '../../api/log/createLog'

/**
 * This mixin injects useful generic functions into the method or publication
 * environment (the funciton's this-context).
 *
 * @param options
 * @return {*}
 */
export const environmentExtensionMixin = (options) => {
	const { env } = options
	if (env === null || env === false) return options

	const envOptions = env || {}
	const { devOnly = true } = envOptions

	const debug = createLog(options.name, { type: 'debug', devOnly })
	const error = createLog(options.name, { type: 'error', devOnly })
	const runFct = options.run

	options.run = function run(...args) {
		// safe-assign our extensions to the environment document
		Object.assign(this, { debug, error })

		debug('called by', this.userId, 'with args', JSON.stringify(args))
		try {
			return runFct.call(this, ...args)
		} catch (e) {
			error(e)
			throw e
		}
	}

	return options
}
