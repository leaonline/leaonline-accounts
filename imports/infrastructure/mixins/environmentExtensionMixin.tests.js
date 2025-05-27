/* eslint-env mocha */
import { expect } from "chai";
import { Random } from "meteor/random";
import { environmentExtensionMixin } from "./environmentExtensionMixin";
import { expectThrow } from "../../../tests/testUtils.tests";

describe(environmentExtensionMixin.name, function () {
	it("returns the options if set to null", function () {
		const options = { env: null };
		const options2 = { env: false };
		expect(environmentExtensionMixin(options)).to.deep.equal(options);
		expect(environmentExtensionMixin(options2)).to.deep.equal(options2);
	});
	it("assigns helper functions to the environment", async () => {
		const userId = Random.id();
		const options = {
			name: Random.id(8),
			run: async function () {
				expect(this.debug).to.be.a("function");
				expect(this.error).to.be.a("function");
				// preserves original env
				expect(this.userId).to.equal(userId);
				return this.userId;
			},
		};

		const updated = environmentExtensionMixin(options);
		const value = await updated.run.call({ userId });
		expect(value).to.equal(userId);
	});
	it("passes all parameters", async () => {
		const testArgs = [];
		testArgs.length = 5 + Math.floor(Math.random() * 10);
		testArgs.fill(-99);

		const options = {
			name: Random.id(8),
			run: async function (...args) {
				expect(args).to.deep.equal(testArgs);
			},
		};

		const updated = environmentExtensionMixin(options);
		await updated.run(...testArgs);
	});
	it("rethrows errors and logs them", async () => {
		const errorId = `expected error - ${Random.id()}`;
		const options = {
			name: Random.id(8),
			run: async function () {
				throw new Error(errorId);
			},
		};

		const updated = environmentExtensionMixin(options);
		await expectThrow({
			fn: () => updated.run(),
			message: errorId,
		});
	});
});
