import AdminNavbar from '../components/AdminNavbar.js';

export default {
    components: {
        AdminNavbar
    },
    data() {
        return {
            selectedCategory: '',
            searchQuery: '',
            searchResults: [],
            tables: {
                services: [],
                customers: [],
                professionals: [],
                serviceRequests: []
            }
        };
    },
    template: `
    <div>
        <div class="container mt-5">
            <h1 class="text-center mb-4">Searching for Something?</h1>
            <div class="form-group">
                <select v-model="selectedCategory" @change="performSearch" class="form-control mb-3">
                    <option value="" disabled>Select Category</option>
                    <option value="services">Services</option>
                    <option value="customers">Customers</option>
                    <option value="professionals">Professionals</option>
                    <option value="serviceRequests">Service Requests</option>
                </select>
                <input type="text" v-model="searchQuery" placeholder="Search by keyword" @input="performSearch" class="form-control" />
            </div>
            <div v-if="searchResults.length">
                <h2 class="mt-4">Search Results</h2>
                <div v-if="selectedCategory === 'customers'">
                    <h3>Customers</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Roles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="customer in searchResults" :key="customer.id">
                                <td>{{ customer.id }}</td>
                                <td>{{ customer.name }}</td>
                                <td>{{ customer.email }}</td>
                                <td>{{ customer.address }}</td>
                                <td>{{ customer.roles.join(', ') }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="editCustomer(customer)">Edit</button>
                                    <button class="btn btn-danger" @click="deleteCustomer(customer.id)">Delete</button>
                                    <button class="btn btn-warning" @click="blockCustomer(customer.id)">Block</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="selectedCategory === 'professionals'">
                    <h3>Service Professionals</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Service Type</th>
                                <th>Experience</th>
                                <th>Address</th>
                                <th>Date Created</th>
                                <th>Active</th>
                                <th>Roles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="professional in searchResults" :key="professional.id">
                                <td>{{ professional.id }}</td>
                                <td>{{ professional.name }}</td>
                                <td>{{ professional.email }}</td>
                                <td>{{ professional.service_type }}</td>
                                <td>{{ professional.experience }}</td>
                                <td>{{ professional.address }}</td>
                                <td>{{ professional.date_created }}</td>
                                <td>{{ professional.active }}</td>
                                <td>{{ professional.roles.join(', ') }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="editProfessional(professional)">Edit</button>
                                    <button class="btn btn-danger" @click="deleteProfessional(professional.id)">Delete</button>
                                    <button class="btn btn-warning" @click="blockProfessional(professional.id)">Block</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="selectedCategory === 'services'">
                    <h3>Services</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in searchResults" :key="service.id">
                                <td>{{ service.id }}</td>
                                <td>{{ service.name }}</td>
                                <td>{{ service.price }}</td>
                                <td>{{ service.description }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="editService(service)">Edit</button>
                                    <button class="btn btn-danger" @click="deleteService(service.id)">Delete</button>
                                    <button class="btn btn-warning" @click="blockService(service.id)">Block</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="selectedCategory === 'serviceRequests'">
                    <h3>Service Requests</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service Name</th>
                                <th>Customer Name</th>
                                <th>Professional Name</th>
                                <th>Date of Request</th>
                                <th>Date of Completion</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="request in searchResults" :key="request.request_id">
                                <td>{{ request.request_id }}</td>
                                <td>{{ request.service_name }}</td>
                                <td>{{ request.customer_name }}</td>
                                <td>{{ request.professional_name }}</td>
                                <td>{{ request.date_of_request }}</td>
                                <td>{{ request.date_of_completion }}</td>
                                <td>{{ request.service_status }}</td>
                                <td>{{ request.remarks }}</td>
                                <td>{{ request.rating }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <p>No results found.</p>
            </div>
        </div>
    </div>
    `,
    created() {
        this.fetchTables();
    },
    methods: {
        fetchTables() {
            // Fetch data for all tables
            fetch('/services', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.tables.services = data;
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });

            fetch('/users', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.tables.customers = data.filter(user => user.roles.includes('customer'));
                this.tables.professionals = data.filter(user => user.roles.includes('service_professional'));
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

            fetch('/service_requests', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.tables.serviceRequests = data;
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
        },
        performSearch() {
            const category = this.selectedCategory;
            const query = this.searchQuery.toLowerCase();

            if (category && query) {
                this.searchResults = this.tables[category].filter(item =>
                    Object.values(item).some(value =>
                        value && value.toString().toLowerCase().includes(query)
                    )
                );
            } else if (category) {
                this.searchResults = this.tables[category];
            } else {
                this.searchResults = [];
            }
        },
        editService(service) {
            // Implement the logic to edit the service
            console.log('Editing service:', service);
        },
        deleteService(serviceId) {
            fetch(`/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error deleting service');
                }
            })
            .catch(error => {
                console.error('Error deleting service:', error);
            });
        },
        blockService(serviceId) {
            fetch(`/services/${serviceId}/block`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error blocking service');
                }
            })
            .catch(error => {
                console.error('Error blocking service:', error);
            });
        },
        editCustomer(customer) {
            // Implement the logic to edit the customer
            console.log('Editing customer:', customer);
        },
        deleteCustomer(customerId) {
            fetch(`/customers/${customerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error deleting customer');
                }
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
            });
        },
        blockCustomer(customerId) {
            fetch(`/customers/${customerId}/block`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error blocking customer');
                }
            })
            .catch(error => {
                console.error('Error blocking customer:', error);
            });
        },
        editProfessional(professional) {
            // Implement the logic to edit the professional
            console.log('Editing professional:', professional);
        },
        deleteProfessional(professionalId) {
            fetch(`/professionals/${professionalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error deleting professional');
                }
            })
            .catch(error => {
                console.error('Error deleting professional:', error);
            });
        },
        blockProfessional(professionalId) {
            fetch(`/professionals/${professionalId}/block`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchTables();
                } else {
                    console.error('Error blocking professional');
                }
            })
            .catch(error => {
                console.error('Error blocking professional:', error);
            });
        }
    }
};