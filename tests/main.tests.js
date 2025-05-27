import { onServerExec } from '../imports/api/utils/onServerExec'

onServerExec(() => {
	require('./api/server/accounts.tests')
	require('./api/server/contexts.tests')
	require('./api/server/mixins.tests')
	require('./api/server/oauth.tests')
})
