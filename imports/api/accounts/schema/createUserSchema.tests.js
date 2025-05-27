/* eslint-env mocha */
import { createUserSchema } from "./createUserSchema";
import { Schema } from "../../schema/Schema";
import { expect } from "chai";

describe("createUserSchema", function () {
	const firstName = "john";
	const lastName = "doe";
	const email = "johndoe@example.com";
	const institution = "core-team";
	const roles = ["backend"];
	const doc = {
		firstName,
		lastName,
		email,
		institution,
		roles,
	};
	const schema = Schema.create(createUserSchema);

	it("validates a doc", function () {
		expect(schema.validate(doc)).to.equal(undefined);
	});

	it("throws on invalid credentials", function () {
		Object.keys(doc).forEach((key) => {
			const copy = { ...doc };
			// eslint-disable-next-line security/detect-object-injection
			delete copy[key];
			expect(() => schema.validate(copy)).to.throw("is required");
		});
	});

	it("throws on invalid email", function () {
		const copy = { ...doc };
		copy.email = "dsadad";
		expect(() => schema.validate(copy)).to.throw(
			"must be a valid email address",
		);
	});

	it("throws on empty roles", function () {
		const copy = { ...doc };
		copy.roles = [];
		expect(() => schema.validate(copy)).to.throw(
			"must specify at least 1 values",
		);
	});
});
