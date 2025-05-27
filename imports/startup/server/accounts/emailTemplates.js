import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { i18n } from "../../../api/i18n/i18n";

const settings = Meteor.settings.accounts.emailTemplates;

Accounts.emailTemplates.siteName = settings.siteName;
Accounts.emailTemplates.from = settings.from;

Accounts.emailTemplates.enrollAccount.subject = (/* user */) => {
	return i18n.get("accounts.enroll.subject", settings);
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
	const email = user.emails[0]?.address;
	const cleanUrl =
		url.replace("/#/", "/") + `?email=${encodeURIComponent(email)}`;

	if (Meteor.isDevelopment) {
		console.log(`
================================================================================
DEV: ENROL ACCOUNT
================================================================================

Username: ${user.username}
email:    ${user.emails[0].address}
roles:    ${user.roles}

Please use the following link to set a password for your user:
${cleanUrl}

Please DO NOT TRY TO USE THE LINK BELOW from the email output as it often 
contains line breaks and may be incomplete.`);
	}

	const name = `${user.firstName} ${user.lastName}`;
	const options = { name, siteName: settings.siteName, url: cleanUrl };
	return i18n.get("accounts.enroll.text", options);
};

// Accounts.emailTemplates.verifyEmail.subject = (/* user */) => {
//   return i18n.get('accounts.verifyEmail.subject', settings)
// }
//
// Accounts.emailTemplates.verifyEmail.text = (user, url) => {
//   if (Meteor.isDevelopment) {
//     console.log('verifyEmail', user, url)
//   }
//   return `Hey ${user}! Verify your e-mail by following this link: ${url}`
// }

Accounts.emailTemplates.resetPassword.subject = (user) => {
	return i18n.get("accounts.resetPassword.subject", settings);
};

Accounts.emailTemplates.resetPassword.text = (user, url) => {
	const email = user.emails[0]?.address;
	const cleanUrl =
		url.replace("/#/", "/") + `?email=${encodeURIComponent(email)}`;

	if (Meteor.isDevelopment) {
		console.log("resetPassword", user, cleanUrl);
	}

	const name = `${user.firstName} ${user.lastName}`;
	const options = { name, siteName: settings.siteName, url: cleanUrl };
	return i18n.get("accounts.resetPassword.text", options);
};
