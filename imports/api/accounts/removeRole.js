import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { createLog } from "../log/createLog";

const debug = createLog("removeUsersFromRoles", { type: "debug" });

export const removeRole = async (userId, role, institution) => {
	debug(userId, role, institution);

	if (!(await Meteor.roles.countDocuments({ _id: role }))) {
		throw new Meteor.Error("removeRole.failed", "removeRole.unknownRole", role);
	}

	if (!(await Meteor.users.countDocuments({ _id: userId }))) {
		throw new Meteor.Error("removeRole.failed", "removeRole.unknownUser");
	}

	if (!(await Roles.userIsInRoleAsync(userId, role, institution))) {
		const details = JSON.stringify({ userId, role, institution });
		throw new Meteor.Error(
			"removeRole.failed",
			"removeRole.roleNotAssigned",
			details,
		);
	}

	await Roles.removeUsersFromRolesAsync(userId, role, institution);

	if (await Roles.userIsInRoleAsync(userId, role, institution)) {
		const details = JSON.stringify({ userId, role, institution });
		throw new Meteor.Error(
			"removeRole.failed",
			"removeRole.roleNotRemoved",
			details,
		);
	}

	return true;
};
