/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { expect } from "chai";
import { Random } from "meteor/random";
import { stub, restoreAll, overrideStub } from "../../../tests/testUtils.tests";
import { OAuth } from "./OAuth";

describe("OAuth", function () {
	describe(OAuth.getClientKey.name, function () {
		it("returns no client key, if not defined in settings", function () {
			expect(OAuth.getClientKey(Random.id())).to.equal(undefined);
		});
		it("returns all keys for clients in settings", function () {
			Meteor.settings.oauth.clients.forEach(({ clientId, key }) => {
				expect(OAuth.getClientKey(clientId)).to.equal(key);
			});
		});
	});
	describe(OAuth.getIdentity.name, function () {
		afterEach(function () {
			restoreAll();
		});
		it("returns undefined if no user is found", async function () {
			stub(Meteor.users, "findOneAsync", async () => {});
			expect(await OAuth.getIdentity()).to.equal(undefined);
			expect(await OAuth.getIdentity(Random.id())).to.equal(undefined);

			overrideStub(Meteor.users, "findOneAsync", async () => {});
			expect(await OAuth.getIdentity()).to.equal(undefined);
			expect(await OAuth.getIdentity(Random.id())).to.equal(undefined);
		});
		it("returns a valid identity", async function () {
			const user = {
				_id: Random.id(6),
				username: Random.id(6),
				firstName: Random.id(6),
				lastName: Random.id(6),
				emails: [{ address: [Random.id(6)] }],
				roles: ["foo", "bar"],
			};
			stub(Meteor.users, "findOneAsync", () => user);
			const result = await OAuth.getIdentity(Random.id());
			expect(result).to.deep.equal({
				id: user._id,
				login: user.username,
				email: user.emails?.[0]?.address,
				firstName: user.firstName,
				lastName: user.lastName,
				name: `${user.firstName} ${user.lastName}`,
				roles: ["foo", "bar"],
			});
		});
	});
});
