import { Meteor } from "meteor/meteor";

/**
 * In-memory registry for OAuth workflow.
 */
export const OAuth = {};

/** @private */
const settings = Meteor.settings.oauth.clients;
/** @private */
const clients = new Map();

settings.forEach((entry) => {
	clients.set(entry.clientId, entry.key);
});

/**
 * Returns the "primary" for a client by clientId.
 * This key is usually not stored in the OAuth clients
 * collection.
 * @param clientId {string}
 * @return {string|undefined}
 */
const getClientKey = (clientId) => clients.get(clientId);

/**
 * Returns the "identity" of a user by given userId.
 * Note, the returned document is stripped from sensitive
 * fields like {services}.
 *
 * @async
 * @param userId {string}
 * @return {Promise<{
 *  firstName:string,
 *  lastName:string,
 *  roles: string[],
 *  name: string,
 *  id:string,
 *  login:string?,
 *  email: string
 *  }>}
 */
const getIdentity = async (userId) => {
	const user = userId && (await Meteor.users.findOneAsync(userId));
	if (!user) return;

	return {
		id: user._id,
		login: user.username,
		email: user.emails?.[0]?.address,
		firstName: user.firstName,
		lastName: user.lastName,
		name: `${user.firstName} ${user.lastName}`,
		roles: [].concat(user.roles || []),
	};
};

Object.assign(OAuth, { getClientKey, getIdentity });
