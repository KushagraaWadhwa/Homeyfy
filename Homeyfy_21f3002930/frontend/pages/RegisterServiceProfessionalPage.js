export default {
    template: `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div class="card-body">
                        <h1 class="card-title text-center">Come work with us?</h1>
                        <form @submit.prevent="submitRegister">
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" v-model="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" v-model="password" class="form-control" id="password" required>
                            </div>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" v-model="name" class="form-control" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="serviceType">Service Type:</label>
                                <select v-model="serviceType" class="form-control" id="serviceType" required>
                                    <option disabled value="">Select Service Type</option>
                                    <option v-for="type in serviceTypes" :key="type.id" :value="type.name">{{ type.name }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="experience">Experience:</label>
                                <input type="text" v-model="experience" class="form-control" id="experience" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Address:</label>
                                <input type="text" v-model="address" class="form-control" id="address" required>
                            </div>
                            <div class="form-group">
                                <label for="pincode">Pincode:</label>
                                <input type="text" v-model="pincode" class="form-control" id="pincode" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Description:</label>
                                <textarea v-model="description" class="form-control" id="description" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="document">Document:</label>
                                <input type="file" @change="handleFileUpload" class="form-control-file" id="document" required>
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
            email: null,
            password: null,
            name: null,
            serviceType: '',
            serviceTypes: [],
            experience: null,
            address: null,
            pincode: null,
            description: null,
            document: null
        }
    },
    async created() {
        await this.fetchServiceTypes();
    },
    methods: {
        async fetchServiceTypes() {
            const res = await fetch(location.origin + '/services', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.$store.state.auth_token}` }
            });
            if (res.ok) {
                this.serviceTypes = await res.json();
            } else {
                console.error('Failed to fetch service types');
            }
        },
        handleFileUpload(event) {
            this.document = event.target.files[0];
        },
        async submitRegister() {
            const formData = new FormData();
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('name', this.name);
            formData.append('service_type', this.serviceType);
            formData.append('experience', this.experience);
            formData.append('address', this.address);
            formData.append('pincode', this.pincode);
            formData.append('description', this.description);
            formData.append('document', this.document);

            const res = await fetch(location.origin + '/register/service_professional', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                alert('Service professional registered successfully');
                this.$router.push('/login');
            } else {
                console.error('Registration failed');
                alert('Registration failed');
            }
        }
    }
}