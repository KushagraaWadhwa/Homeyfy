export default {
    template: `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-body">
                        <h1 class="card-title text-center">Register with us now!!</h1>
                        <form @submit.prevent="submitRegister">
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" v-model="name" class="form-control" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" v-model="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" v-model="password" class="form-control" id="password" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Address:</label>
                                <input type="text" v-model="address" class="form-control" id="address" required>
                            </div>
                            <div class="form-group">
                                <label for="pincode">Pincode:</label>
                                <input type="text" v-model="pincode" class="form-control" id="pincode" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block mt-3">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            name: null,
            email: null,
            password: null,
            address: null,
            pincode: null
        }
    },
    methods: {
        async submitRegister() {
            const res = await fetch(location.origin + '/register/customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'name': this.name, 'email': this.email, 'password': this.password, 'address': this.address, 'pincode': this.pincode })
            });
            if (res.ok) {
                alert('Customer registered successfully');
                this.$router.push('/login');
            } else {
                console.error('Registration failed');
                alert('Registration failed');
            }
        }
    }
}