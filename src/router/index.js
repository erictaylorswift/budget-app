import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Details from '@/components/Details'
import Main from '@/components/Main'
import BudgetForm from '@/components/BudgetForm'
import CurrentBudget from '@/components/CurrentBudget'
import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/',
            name: 'Main',
			component: Main,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/expenses',
			name: 'Details',
			component: Details,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/budget',
			name: 'Budget',
			component: BudgetForm,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/current-budget',
			name: 'CurrentBudget',
			component: CurrentBudget,
			meta: {
				requiresAuth: true
			}
		}
	]
})


export default router