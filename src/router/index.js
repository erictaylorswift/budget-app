import Vue from 'vue'
import Router from 'vue-router'

import Details from '@/components/Details'
import Home from '@/components/Home'
import BudgetForm from '@/components/BudgetForm'
import CurrentBudget from '@/components/CurrentBudget'
import Login from '@/components/Login'
import NewBudget from '@/components/NewBudget'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/home',
            name: 'Home',
			component: Home,
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
		},
		{
			path: '/new-budget',
			name: 'NewBudget',
			component: NewBudget
		}
	]
})


export default router