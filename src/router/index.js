import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Details from '@/components/Details'
import Home from '@/components/Home'
// import BudgetForm from '@/components/BudgetForm'
import CurrentBudget from '@/components/CurrentBudget'
import HomeScreen from '@/components/home_screen/Home'
import NewBudget from '@/components/NewBudget'
import Settings from '@/pages/Settings'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
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
      component: HomeScreen
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
      component: NewBudget,
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
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('home')
  else next()
})

export default router
