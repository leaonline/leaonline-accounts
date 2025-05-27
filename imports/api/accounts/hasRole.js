import { Roles } from "meteor/alanning:roles";

export const hasRole = async (userId, role, institution) =>
	Roles.userIsInRoleAsync(userId, role, institution);
