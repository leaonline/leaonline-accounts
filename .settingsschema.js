module.exports = (SimpleSchema) => (settings) => {
	const schema = (def) => new SimpleSchema(def)
	const oauthFlows = ['authorization_code']
	const relativeUrl = {
		type: String,
		regEx: /\/[a-zA-Z\/-]+/,
	}

	const settingsSchema = schema({
		public: schema({
			oauth: schema({
				dialogUrl: relativeUrl,
				accessTokenUrl: relativeUrl,
				authorizeUrl: relativeUrl,
				identityUrl: relativeUrl,
				errorUrl: relativeUrl,
				fallbackUrl: relativeUrl,
			}),
			password: schema({
				min: SimpleSchema.Integer,
				max: SimpleSchema.Integer,
				icon: String,
				confirm: Boolean,
				blacklist: [String],
			}),
			links: Array,
			'links.$': Object,
			'links.$.label': String,
			'links.$.url': String,
		}),
		accounts: schema({
			emailTemplates: schema({
				siteName: String,
				from: {
					type: String,
					regEx: SimpleSchema.RegEx.EmailWithTLD,
				},
			}),
			config: schema({
				forbidClientAccountCreation: Boolean,
				ambiguousErrorMessages: Boolean,
				sendVerificationEmail: Boolean,
				loginExpirationInDays: SimpleSchema.Integer,
				passwordResetTokenExpirationInDays: SimpleSchema.Integer,
				passwordEnrollTokenExpirationInDays: SimpleSchema.Integer,
			}),
			users: {
				type: Array,
				optional: true,
			},
			'users.$': schema({
				username: {
					type: String,
					optional: true,
				},
				password: {
					type: String,
					optional: true,
				},
				email: {
					type: String,
					regEx: SimpleSchema.RegEx.EmailWithTLD,
				},
				firstName: String,
				lastName: String,
				institution: String,
				roles: Array,
				'roles.$': String,
				retry: {
					type: Boolean,
					optional: true,
				},
			}),
		}),
		oauth: schema({
			debug: Boolean,
			clients: Array,
			'clients.$': schema({
				key: String,
				title: String,
				description: String,
				clientId: {
					type: String,
					regEx: SimpleSchema.RegEx.idOfLength(16, null),
				},
				secret: {
					type: String,
					min: 32,
				},
				url: {
					type: String,
					regEx: SimpleSchema.RegEx.WeakUrl,
				},
				redirectUris: Array,
				'redirectUris.$': {
					type: String,
					regEx: SimpleSchema.RegEx.WeakUrl,
				},
				grants: Array,
				'grants.$': {
					type: String,
					allowedValues: oauthFlows,
				},
			}),
			server: schema({
				addAcceptedScopesHeader: Boolean,
				addAuthorizedScopesHeader: Boolean,
				allowBearerTokensInQueryString: Boolean,
				allowEmptyState: Boolean,
				authorizationCodeLifetime: SimpleSchema.Integer,
				accessTokenLifetime: SimpleSchema.Integer,
				refreshTokenLifetime: SimpleSchema.Integer,
				allowExtendedTokenAttributes: Boolean,
				requireClientAuthentication: Boolean,
			}),
			model: schema({
				debug: Boolean,
				accessTokensCollectionName: String,
				refreshTokensCollectionName: String,
				clientsCollectionName: String,
				authCodesCollectionName: String,
			}),
		}),
		status: schema({
			active: Boolean,
			interval: Number,
			secret: String,
			url: String,
		}),
	})

	settingsSchema.validate(settings)
}
