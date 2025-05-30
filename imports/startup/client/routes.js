import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { Routes } from '../../api/routes/Routes'

Routes.each((route) => {
	console.debug('[Router]: create route', route.path())
	FlowRouter.route(route.path(), {
		waitOn: route.include,
		triggersEnter: route.triggersEnter,
		action: function (params, queryParams) {
			this.render(route.layout || Routes.defaultLayout, route.template, {
				params,
				queryParams,
			})
		},
	})
})
