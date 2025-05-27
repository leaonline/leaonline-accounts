import { i18n } from "../../i18n/i18n";
import { RegEx } from "../../schema/Schema";

export const getLoginSchema = () => ({
	email: {
		type: String,
		label: () => i18n.get("user.email"),
		regEx: RegEx.EmailWithTLD,
		autoform: {
			type: "email",
		},
	},
	password: {
		type: String,
		label: () => i18n.get("user.password"),
		autoform: {
			type: "password",
		},
	},
});
