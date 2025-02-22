const Home = {
    template: `
        <div style="position: relative; height: 90vh; display: flex; justify-content: center; align-items: center; text-align: center; color: white; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;  background-position: center; background-repeat: no-repeat; background-size: cover; filter: blur(8px); z-index: -1;"></div>
            <h1 style="color: #007bff; z-index: 1;">Welcome to the Household Services App-"Homeyfy"!!!! <br>One stop solution for all your household chores</h1>
        </div>
    `
}
import AdminDashboardPage from "../pages/AdminDashboardPage.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterCustomerPage from "../pages/RegisterCustomerPage.js";
import CustomerProfilePage from "../pages/CustomerProfilePage.js";  
import CustomerServiceRequestsPage from "../pages/CustomerServiceRequestsPage.js";  
import CustomerDashboardPage from "../pages/CustomerDashboardPage.js";
import AdminSearchPage from "../pages/AdminSearchPage.js";
import AdminSummaryPage from "../pages/AdminSummaryPage.js";
import CustomerSearchPage from "../pages/CustomerSearchPage.js";
import CustomerSummaryPage from "../pages/CustomerSummaryPage.js";
import RegisterServiceProfessionalPage from "../pages/RegisterServiceProfessionalPage.js";
import ServiceProfessionalDashboardPage from "../pages/ServiceProfessionalDashboardPage.js";
import ServiceProfessionalSummaryPage from "../pages/ServiceProfessionalSummaryPage.js";
import ServiceProfessionalProfilePage from "../pages/ServiceProfessionalProfilePage.js";  



import store from './store.js'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: LoginPage },
    { path: '/register/customer', component: RegisterCustomerPage },
    { path: '/register/service_professional', component: RegisterServiceProfessionalPage },
    { path: '/admin-dashboard', component: AdminDashboardPage, meta: { requiresLogin: true} },
    { path: '/admin-dashboard/search', component: AdminSearchPage, meta: { requiresLogin: true} },
    { path: '/admin-dashboard/summary', component: AdminSummaryPage, meta: { requiresLogin: true} },
    { path: '/service-professional-dashboard', component: ServiceProfessionalDashboardPage, meta: { requiresLogin: true } },
    { path: '/service-professional-dashboard/profile', component: ServiceProfessionalProfilePage, meta: { requiresLogin: true}},    // Add route for ServiceProfessionalProfilePage
    { path: '/service-professional-dashboard/summary', component: ServiceProfessionalSummaryPage, meta: { requiresLogin: true} },
    { path: '/customer-dashboard', component: CustomerDashboardPage, meta: { requiresLogin: true} },
    { path: '/customer-dashboard/search', component: CustomerSearchPage, meta: { requiresLogin: true} },
    { path: '/customer-dashboard/summary', component: CustomerSummaryPage, meta: { requiresLogin: true} },
    { path: '/customer-dashboard/profile', component: CustomerProfilePage, meta: { requiresLogin: true} },  // Add route for CustomerProfilePage
    { path: '/customer-dashboard/service-requests', component: CustomerServiceRequestsPage, meta: { requiresLogin: true} }, 
]

const router = new VueRouter({
    routes
})

// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
        if (!store.state.loggedIn) {
            next({ path: '/login' })
        } else if (to.meta.role && to.meta.role != store.state.role) {
            alert('Role not authorized')
            next({ path: '/' })
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;