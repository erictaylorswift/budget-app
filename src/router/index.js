import Vue from 'vue'
import Router from 'vue-router'

import Details from '@/components/Details'
import Main from '@/components/Main'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
            name: 'Main',
            component: Main
		},
		{
			path: '/expenses',
			name: 'Details',
			component: Details
		}
	]
})

export default router