import AdminNavbar from "./components/AdminNavbar.js"
import CustomerNavbar from "./components/CustomerNavbar.js"
import ServiceProfessionalNavbar from "./components/ServiceProfessionalNavbar.js"
import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"
import store from "./utils/store.js"

const app = new Vue({
    el: '#app',
    template: `
        <div>
            <component :is="currentNavbar" />
            <router-view></router-view>
        </div>
    `,
    components: {
        Navbar,
        AdminNavbar,
        CustomerNavbar,
        ServiceProfessionalNavbar
    },
    
    computed: {
        currentNavbar() {
            if (this.$route.path.startsWith('/admin-dashboard')) {
                return 'AdminNavbar';
            } else if (this.$route.path.startsWith('/customer-dashboard')) {
                return 'CustomerNavbar';
            } else if (this.$route.path.startsWith('/service-professional-dashboard')) {
                return 'ServiceProfessionalNavbar';
            } else {
                return 'Navbar';
            }
        }
    },
    router,
    store,
    created() {
        // Load user from local storage
        this.$store.commit('loadUserFromStorage');

        // Check if user is authenticated
        if (this.$store.getters.isAuthenticated) {
            this.$store.dispatch('fetchCurrentUser');
        }

        // Navigate to the last visited page
        const lastVisitedPage = localStorage.getItem('lastVisitedPage');
        if (lastVisitedPage) {
            this.$router.push(lastVisitedPage);
        }else{
            this.$router.push('/');
        }
    }
});

// Store the current page before the page unloads
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastVisitedPage', router.currentRoute.fullPath);
});