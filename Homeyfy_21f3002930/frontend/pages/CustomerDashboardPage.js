import CustomerNavbar from '../components/CustomerNavbar.js';

export default {
    components: {
        CustomerNavbar
    },
    data() {
        return {
            services: [],
            filteredServices: [],
            professionals: [],  // Add a list to store professionals
            allUsers: [],  // Add a list to store all users
            showNoProfessionalsMessage: false,  // Add a flag to control the visibility of the message
            selectedService: null,  // Add a property to store the selected service
        };
    },
    computed: {
        userDetails() {
            return this.$store.getters.userDetails;
        },
        userName() {
            return this.$store.state.user ? this.$store.state.user.name : '';
            },
        filteredServices() {
            return this.services.filter(service => this.filterService(service));
            }
        },
        
    template: `
    <div>
    <br>
        <div class="container">
            <h1 style="text-align: center;">Customer Dashboard </h1>
            <br>
                <router-link to="/customer-dashboard/profile" class="btn btn-secondary" >View/Edit Profile</router-link>
            </div>
           
            <h2 class="my-4" style="text-align: center;">What service are you looking for today???</h2>
            <div class="d-flex flex-row flex-nowrap overflow-auto">
                <div class="card m-2" style="min-width: 200px;" v-for="service in filteredServices" :key="service.id">
                    <div class="card-body">
                        <h5 class="card-title">{{ service.name }}</h5>
                        <p class="card-text">{{ service.description }}</p>
                        <p class="card-text">Base Price: {{ service.price }}</p>
                        <button class="btn btn-primary" @click="requestService(service)">Request Service</button>
                    </div>
                </div>
            </div>
            <div v-if="professionals.length > 0" class="mt-4">
                <h2>Available Professionals</h2>
                <div class="d-flex flex-row flex-nowrap overflow-auto">
                    <div class="card m-2" style="min-width: 200px;" v-for="professional in professionals" :key="professional.id">
                        <div class="card-body">
                            <h5 class="card-title">{{ professional.name }}</h5>
                            <p class="card-text">Experience: {{ professional.experience }} years</p>
                            <p class="card-text">Service Type: {{ professional.service_type }}</p>
                            <p class="card-text">Pincode: {{ professional.pincode }}</p>
                            <p class="card-text">Description: {{ professional.description }}</p>
                            <button class="btn btn-success" @click="bookProfessional(professional)">Book Professional</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showNoProfessionalsMessage" class="mt-4">
                <h2>No professionals available at the moment</h2>
            </div>
        </div>
    </div>
    `,
    created() {
        this.fetchServices();
        this.fetchUsers();
        this.$store.commit('loadUserFromStorage');  // Load user details from local storage on page refresh
    },
    methods: {
        fetchServices() {
            fetch('/services', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.services = data;
                this.filteredServices = data;
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
        },
        fetchUsers() {
            fetch('/users', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.allUsers = data;
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
        },
        filterServices() {
            const query = this.searchQuery.toLowerCase();
            this.filteredServices = this.services.filter(service =>
                service.name.toLowerCase().includes(query) ||
                service.description.toLowerCase().includes(query)
            );
        },
        requestService(service) {
            this.selectedService = service;  // Store the selected service
            const userPincode = parseInt(this.userDetails.pincode);
            this.professionals = this.allUsers.filter(user => 
                user.roles.includes('service_professional') &&
                user.service_type === service.name &&
                Math.abs(parseInt(user.pincode) - userPincode) <= 20
            );
            this.showNoProfessionalsMessage = this.professionals.length === 0;
        },
        bookProfessional(professional) {
            console.log('Booking professional:', professional);
            console.log('Service:', this.selectedService);
            const serviceRequest = {
                customer_id: this.userDetails.id,
                professional_id: professional.id,
                service_id: this.selectedService.id,
                service_type: professional.service_type,
                date_of_request: new Date().toISOString().split('T')[0],  // Current date
                // service_status: 'requested'  // Already done in the backend
            };
            fetch('/service_requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(serviceRequest)
            })
            .then(response => {
                if (response.ok) {
                    alert('The professional has been booked successfully.');
                } else {
                    throw new Error('Error creating service request');
                }
            })
            .catch(error => {
                console.error('Error creating service request:', error);
            });
        }
    }
};