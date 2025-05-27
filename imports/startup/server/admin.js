import { Admin } from "../../api/admin/Admin";
import { createMethod } from "../../infrastructure/factories/createMethod";
import { rateLimitMethods } from "meteor/leaonline:ratelimit-factory";

const methods = Object.values(Admin.methods);
methods.forEach((method) => {
	console.debug("[createMethod]:", method.name);
	createMethod(method);
});
rateLimitMethods(methods);
