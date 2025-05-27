import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Accounts } from "meteor/accounts-base";
import { ReactiveDict } from "meteor/reactive-dict";
import { Schema } from "../../../api/schema/Schema";
import { getResetPasswordSchema } from "../../../api/accounts/schema/getResetPasswordSchema";
import { formIsValid, removeErrors } from "../../utils/formIsValid";
import "./enroll.html";

let setPasswordSchema;

Template.enroll.onCreated(function () {
	const instance = this;
	instance.state = new ReactiveDict();

	const setup = () => {
		const data = Template.currentData();
		const { email } = data.queryParams;
		setPasswordSchema = Schema.create(getResetPasswordSchema(email));
		instance.state.set("ready", true);
	};

	if (Meteor.user() || Meteor.userId()) {
		// we log out here because we can't know for sure,
		// if there is a multi-user machine in use, so we
		// assume the current operation to be fundamental
		// to the email receiver and clear any login user
		Meteor.logoutOtherClients();
		Meteor.logout((error) => {
			if (error) instance.state.set({ error });
			setup();
		});
	} else {
		setup();
	}
});

Template.enroll.helpers({
	error() {
		return Template.instance().state.get("error");
	},
	ready() {
		return Template.instance().state.get("ready");
	},
	successful() {
		return Template.instance().state.get("successful");
	},
	setPasswordSchema() {
		return setPasswordSchema;
	},
	links() {
		return Meteor.settings.public.links;
	},
});

Template.enroll.events({
	"submit #enrollmentForm"(event, templateInstance) {
		event.preventDefault();
		removeErrors("enrollmentForm");

		const insertDoc = formIsValid("enrollmentForm", setPasswordSchema);
		const token = templateInstance.data.params.token;

		if (!insertDoc || !token) {
			return;
		}

		templateInstance.state.set("resetting", true);
		const { password } = insertDoc;

		Accounts.resetPassword(token, password, (error) => {
			templateInstance.state.set("resetting", false);
			if (error) {
				templateInstance.state.set({ error });
			} else {
				templateInstance.state.set("successful", true);
			}
		});
	},
});
