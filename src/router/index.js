import Vue from 'vue'
import Router from 'vue-router'

import Details from '@/components/Details'
import Main from '@/components/Main'
import BudgetForm from '@/components/BudgetForm'
import CurrentBudget from '@/components/CurrentBudget'

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
		},
		{
			path: '/budget',
			name: 'Budget',
			component: BudgetForm
		},
		{
			path: '/current-budget',
			name: 'CurrentBudget',
			component: CurrentBudget
		}
	]
})

export default router