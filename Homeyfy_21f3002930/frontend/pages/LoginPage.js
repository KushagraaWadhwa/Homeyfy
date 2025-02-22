export default {
    data() {
        return {
            email: null,
            password: null,
        }
    },
    methods: {
        async submitLogin() {
            const res = await fetch(location.origin + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': this.email, 'password': this.password })
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.active && data.role == 'service_professional') {
                    alert('Please wait for your approval from the admin!!');
                    return;
                }
                localStorage.setItem('user', JSON.stringify(data));
                this.$store.commit('setUser', data);
                alert('Logged in successfully');
                console.log('Logged in successfully');
                if (data.role === 'admin') {
                    this.$router.push('/admin-dashboard');
                } else if (data.role === 'service_professional') {
                    this.$router.push('/service-professional-dashboard');
                } else if (data.role === 'customer') {
                    this.$router.push('/customer-dashboard');
                }
            } else {
                const errorData = await res.json();
                console.error('Login failed:', errorData.message);
                alert('Login Failed: ' + errorData.message);
            }
        }
    },
    template: `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-body">
                        <h1 class="card-title text-center">Login</h1>
                        <form @submit.prevent="submitLogin">
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" v-model="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" v-model="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block mt-3">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};