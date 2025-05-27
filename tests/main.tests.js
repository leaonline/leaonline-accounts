import { onServerExec } from '../imports/api/utils/onServerExec'

onServerExec(() => {
    import './api/server/accounts.tests'
    import './api/server/contexts.tests'
    import './api/server/mixins.tests'
    import './api/server/oauth.tests'
})

