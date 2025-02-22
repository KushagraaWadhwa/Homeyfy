export default {
    computed: {
        userName() {
            return this.$store.state.user ? this.$store.state.user.name : '';
        }
    },
    template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link class="navbar-brand" to='/service-professional-dashboard'>Welcome {{userName}} !!</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to='/service-professional-dashboard'>Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to='/service-professional-dashboard/profile'>Profile</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to='/service-professional-dashboard/summary'>Summary</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
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
            this.$router.push('/login').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    throw err;
                }
            });
        }
    }
}