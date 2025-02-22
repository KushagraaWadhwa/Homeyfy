export default {
    template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link class="navbar-brand" to='/'>Homeyfy</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to='/'>Home</router-link>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <router-link class="nav-link" to='/login'>Login</router-link>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <router-link class="nav-link" to='/register/customer'>Register as Customer</router-link>
                    </li>
                    <li class="nav-item" v-if="!$store.state.loggedIn">
                        <router-link class="nav-link" to='/register/service_professional'>Register as Service Professional</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'admin'">
                        <router-link class="nav-link" to='/admin-dashboard'>Admin Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'service_professional'">
                        <router-link class="nav-link" to='/service-professional-dashboard'>Service Professional Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role == 'customer'">
                        <router-link class="nav-link" to='/customer-dashboard'>Customer Dashboard</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="$store.state.loggedIn">
                        <button class="btn btn-secondary" @click="logout">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `,
    methods: {
        logout() {
            this.$store.commit('logout');
            this.$router.push('/');
        }
    }
}