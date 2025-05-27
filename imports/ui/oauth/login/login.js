/* global AutoForm */
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
import { Schema } from "../../../api/schema/Schema";
import { getLoginSchema } from "../../../api/accounts/schema/getLoginSchema";
import { getForgotPasswordSchema } from "../../../api/accounts/schema/getForgotPasswordSchema";
import { formIsValid } from "../../utils/formIsValid";
import "./login.html";

const loginSchema = Schema.create(getLoginSchema());
const forgotPasswordSchema = Schema.create(getForgotPasswordSchema());
const ViewStates = {
	login: "login",
	forgotPassword: "forgotPassword",
};

Template.login.onCreated(function () {
	const instance = this;
	instance.state = new ReactiveDict();
	instance.state.set("viewState", ViewStates.login);
});

Template.login.helpers({
	loginSchema() {
		return loginSchema;
	},
	forgotPasswordSchema() {
		return forgotPasswordSchema;
	},
	forgotPasswordDoc() {
		const email = Template.instance().state.get("email");
		return { email };
	},
	forgotPasswordRequestSent() {
		return Template.instance().state.get("forgotPasswordRequestSent");
	},
	sending() {
		return Template.instance().state.get("sending");
	},
	errors() {
		return Template.instance().state.get("errors");
	},
	state(name) {
		return Template.instance().state.get("viewState") === name;
	},
});

Template.login.events({
	"submit #loginForm"(event, templateInstance) {
		event.preventDefault();

		const insertDoc = formIsValid("loginForm", loginSchema);
		if (!insertDoc) return;

		const { email } = insertDoc;
		const { password } = insertDoc;
		templateInstance.state.set("sending", true);

		Meteor.loginWithPassword(email, password, (err, res) => {
			if (err) {
				return templateInstance.state.set("errors", [err]);
			}
			if (res) {
				templateInstance.state.set("sending", false);
			}
		});
	},
	"submit #forgotPasswordForm"(event, templateInstance) {
		event.preventDefault();
		const requestDoc = formIsValid("forgotPasswordForm", forgotPasswordSchema);
		if (!requestDoc) return;

		templateInstance.state.set("sending", true);
		Accounts.forgotPassword(requestDoc, (err) => {
			templateInstance.state.set("sending", false);
			if (err) return templateInstance.state.set("errors", [err]);
			templateInstance.state.set("forgotPasswordRequestSent", true);
		});
	},
	"click .forgot-password-link"(event, templateInstance) {
		event.preventDefault();
		const loginFormValues = AutoForm.getFormValues("loginForm");
		const { email } = loginFormValues.insertDoc;
		templateInstance.state.set({
			email,
			viewState: ViewStates.forgotPassword,
			errors: null,
		});
	},
	"click .to-login-link"(event, templateInstance) {
		event.preventDefault();
		templateInstance.state.set({
			email: null,
			viewState: ViewStates.login,
			errors: null,
		});
	},
});
