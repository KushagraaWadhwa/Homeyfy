import CustomerNavbar from '../components/CustomerNavbar.js';

export default {
    components: {
        CustomerNavbar
    },
    data() {
        return {
            selectedServiceType: '',
            searchQuery: '',
            updateMessage: '',
            searchResults: [],
            services: [],
            allUsers: [],
            professionals: [],
            showNoProfessionalsMessage: false,
            selectedService: null
        };
    },
    computed: {
        userDetails() {
            return this.$store.getters.userDetails;
        },
        userName() {
            return this.$store.state.user ? this.$store.state.user.name : '';
        }
    },
    template: `
    <div>
        <div class="container mt-5">
            <h1 class="text-center mb-4">Searching for something?</h1>
            <div class="form-group">
                <select v-model="selectedServiceType" @change="performSearch" class="form-control mb-3">
                    <option value="" disabled>Select Service Type</option>
                    <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
                </select>
                <input type="text" v-model="searchQuery" placeholder="Search by keyword" @input="performSearch" class="form-control" />
            </div>
            <div v-if="searchResults.length">
                <h2 class="mt-4">Search Results</h2>
                <div class="d-flex flex-row flex-nowrap overflow-auto">
                    <div class="card m-2" style="min-width: 200px;" v-for="service in searchResults" :key="service.id">
                        <div class="card-body">
                            <h5 class="card-title">{{ service.name }}</h5>
                            <p class="card-text">{{ service.description }}</p>
                            <p class="card-text">Price: {{ service.price }}</p>
                            <button class="btn btn-primary" @click="requestService(service)">Request Service</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No results found.</p>
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
                            <button class="btn btn-success" @click="bookProfessional(professional)">Book Professional</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showNoProfessionalsMessage" class="mt-4">
                <h2>No professionals available at the moment</h2>
            </div>
            <div v-if="updateMessage" class="alert alert-info mt-4">{{ updateMessage }}</div>
        </div>
    </div>
    `,
    created() {
        this.fetchServices();
        this.fetchUsers();
        this.$store.commit('loadUserFromStorage');
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
        performSearch() {
            const serviceType = this.selectedServiceType.toLowerCase();
            const query = this.searchQuery.toLowerCase();

            if (serviceType && query) {
                this.searchResults = this.services.filter(service =>
                    service.name.toLowerCase().includes(serviceType) &&
                    (service.description.toLowerCase().includes(query) || service.name.toLowerCase().includes(query))
                );
            } else if (serviceType) {
                this.searchResults = this.services.filter(service =>
                    service.name.toLowerCase().includes(serviceType)
                );
            } else if (query) {
                this.searchResults = this.services.filter(service =>
                    service.description.toLowerCase().includes(query) || service.name.toLowerCase().includes(query)
                );
            } else {
                this.searchResults = [];
            }
        },
        requestService(service) {
            this.selectedService = service;
            const userPincode = parseInt(this.userDetails.pincode);
            this.professionals = this.allUsers.filter(user => 
                user.roles.includes('service_professional') &&
                user.service_type === service.name &&
                Math.abs(parseInt(user.pincode) - userPincode) <= 10
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
                date_of_request: new Date().toISOString().split('T')[0],
                status: 'requested'
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
                    this.updateMessage = 'The professional has been booked successfully.';
                    setTimeout(() => {
                        this.updateMessage = '';
                    }, 7000);
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