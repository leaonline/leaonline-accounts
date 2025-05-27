import { Template } from "meteor/templating";
import { Accounts } from "meteor/accounts-base";
import { ReactiveDict } from "meteor/reactive-dict";
import { Schema } from "../../../api/schema/Schema";
import { getResetPasswordSchema } from "../../../api/accounts/schema/getResetPasswordSchema";
import { formIsValid } from "../../utils/formIsValid";
import "./resetPassword.html";

let resetPasswordSchema;

Template.resetPassword.onCreated(function () {
	const instance = this;
	instance.state = new ReactiveDict();

	const data = Template.currentData();
	const { email } = data.queryParams;
	resetPasswordSchema = Schema.create(getResetPasswordSchema(email));
	instance.state.set("ready", true);
});

Template.resetPassword.helpers({
	resetPasswordSchema() {
		return resetPasswordSchema;
	},
	errors() {
		return Template.instance().state.get("errors");
	},
	resetComplete() {
		return Template.instance().state.get("resetComplete");
	},
	ready() {
		return Template.instance().state.get("ready");
	},
});

Template.resetPassword.events({
	"submit #resetPasswordForm"(event, templateInstance) {
		event.preventDefault();

		const resetDoc = formIsValid("resetPasswordForm", resetPasswordSchema);
		if (!resetDoc) return;

		const { password } = resetDoc;
		const { token } = templateInstance.data.params;
		Accounts.resetPassword(token, password, (err) => {
			if (err) return templateInstance.state.set("errors", [err]);
			templateInstance.state.set("resetComplete", true);
		});
	},
	"click .close-btn"() {
		window.close();
	},
});
