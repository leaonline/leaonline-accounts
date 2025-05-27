export const createLog = (name, { type = 'log' } = {}) => {
	if (!['log', 'debug', 'error', 'warn', 'info'].includes(type)) {
		throw new Error(`Unsupported type ${type}`)
	}

	const infoName = `[${name}]:`
	// eslint-disable-next-line security/detect-object-injection
	const target = console[type]

	return (...args) => target.call(console, infoName, ...args)
}
