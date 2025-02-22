import AdminNavbar from '../components/AdminNavbar.js';

export default {
    components: {
        AdminNavbar
    },
    template: `
    <div>
    <br><br>
        <h1 style="text-align: center;">Your Dashboard</h1>
        <h2>Customers View</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Email</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Address</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Pincode</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Roles</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customers" :key="customer.id" style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">{{ customer.id }}</td>
                    <td style="padding: 10px;">{{ customer.name }}</td>
                    <td style="padding: 10px;">{{ customer.email }}</td>
                    <td style="padding: 10px;">{{ customer.address }}</td>
                    <td style="padding: 10px;">{{ customer.pincode }}</td>
                    <td style="padding: 10px;">{{ customer.roles.join(', ') }}</td>
                    <td style="padding: 10px;">
                        <button @click="editCustomer(customer)">Edit</button>
                        <button @click="deleteUser(customer.id)">Delete</button>
                        <button v-if="customer.active" @click="blockUser(customer.id)">Block</button>
                        <button v-else @click="unblockUser(customer.id)">Unblock</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="editingCustomer">
            <h3>Edit Customer</h3>
            <form @submit.prevent="updateCustomer">
                <div>
                    <label for="customerName">Name:</label>
                    <input type="text" v-model="editingCustomer.name" required>
                </div>
                <div>
                    <label for="customerEmail">Email:</label>
                    <input type="email" v-model="editingCustomer.email" required>
                </div>
                <div>
                    <label for="customerAddress">Address:</label>
                    <input type="text" v-model="editingCustomer.address" required>
                </div>
                <div>
                    <label for="customerPincode">Pincode:</label>
                    <input type="text" v-model="editingCustomer.pincode" required>
                </div>
                <button type="submit">Update Customer</button>
                <button @click="cancelEdit">Cancel</button>
            </form>
        </div>

        <h2>Service Professionals  View</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Email</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Service Type</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Experience</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Address</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Pincode</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Date Created</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Active</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Roles</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Document</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="professional in professionals" :key="professional.id" style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">{{ professional.id }}</td>
                    <td style="padding: 10px;">{{ professional.name }}</td>
                    <td style="padding: 10px;">{{ professional.email }}</td>
                    <td style="padding: 10px;">{{ professional.service_type }}</td>
                    <td style="padding: 10px;">{{ professional.experience }}</td>
                    <td style="padding: 10px;">{{ professional.address }}</td>
                    <td style="padding: 10px;">{{ professional.pincode }}</td>
                    <td style="padding: 10px;">{{ professional.date_created }}</td>
                    <td style="padding: 10px;">{{ professional.active }}</td>
                    <td style="padding: 10px;">{{ professional.roles.join(', ') }}</td>
                    <td style="padding: 10px;"><a :href="'/uploads/' + professional.document" target="_blank">View Document</a></td>
                    <td style="padding: 10px;">
                        <button @click="exportServiceRequests(professional.id)">Export Closed Requests</button>
                        <button v-if="!professional.active" @click="approveProfessional(professional.id)">Approve</button>
                        <button v-if="!professional.active" @click="rejectProfessional(professional.id)">Reject</button>
                        <button @click="editProfessional(professional)">Modify Details</button>
                        <button @click="deleteUser(professional.id)">Terminate</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="editingProfessional">
            <h3>Edit Service Professional</h3>
            <form @submit.prevent="updateProfessional">
                <div>
                    <label for="professionalName">Name:</label>
                    <input type="text" v-model="editingProfessional.name" required>
                </div>
                <div>
                    <label for="professionalEmail">Email:</label>
                    <input type="email" v-model="editingProfessional.email" required>
                </div>
                <div>
                    <label for="professionalServiceType">Service Type:</label>
                    <input type="text" v-model="editingProfessional.service_type" required>
                </div>
                <div>
                    <label for="professionalExperience">Experience:</label>
                    <input type="number" v-model="editingProfessional.experience" required>
                </div>
                <div>
                    <label for="professionalAddress">Address:</label>
                    <input type="text" v-model="editingProfessional.address" required>
                </div>
                <div>
                    <label for="professionalPincode">Pincode:</label>
                    <input type="text" v-model="editingProfessional.pincode" required>
                </div>
                <button type="submit">Update Professional</button>
                <button @click="cancelEdit">Cancel</button>
            </form>
        </div>

        <h2>Services  View</h2>
        <button @click="toggleAddServiceForm">Add Service</button>
        <div v-if="showAddServiceForm">
            <h3>Add New Service</h3>
            <form @submit.prevent="addService">
                <div>
                    <label for="serviceName">Name:</label>
                    <input type="text" v-model="newService.name" required>
                </div>
                <div>
                    <label for="servicePrice">Price:</label>
                    <input type="number" v-model="newService.price" required>
                </div>
                <div>
                    <label for="serviceDescription">Description:</label>
                    <input type="text" v-model="newService.description">
                </div>
                <button type="submit">Add Service</button>
                <button @click="toggleAddServiceForm">Cancel</button>
            </form>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="service in services" :key="service.id" style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">{{ service.id }}</td>
                    <td style="padding: 10px;">{{ service.name }}</td>
                    <td style="padding: 10px;">{{ service.price }}</td>
                    <td style="padding: 10px;">{{ service.description }}</td>
                    <td style="padding: 10px;">
                        <button @click="editService(service)">Edit</button>
                        <button @click="deleteService(service.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="editingService">
            <h3>Edit Service</h3>
            <form @submit.prevent="updateService">
                <div>
                    <label for="serviceName">Name:</label>
                    <input type="text" v-model="editingService.name" required>
                </div>
                <div>
                    <label for="servicePrice">Price:</label>
                    <input type="number" v-model="editingService.price" required>
                </div>
                <div>
                    <label for="serviceDescription">Description:</label>
                    <input type="text" v-model="editingService.description">
                </div>
                <button type="submit">Update Service</button>
                <button @click="cancelEdit">Cancel</button>
            </form>
        </div>
        <button @click="toggleAddServiceForm">Add Service</button>
        <div v-if="showAddServiceForm">
            <h3>Add New Service</h3>
            <form @submit.prevent="addService">
                <div>
                    <label for="serviceName">Name:</label>
                    <input type="text" v-model="newService.name" required>
                </div>
                <div>
                    <label for="servicePrice">Price:</label>
                    <input type="number" v-model="newService.price" required>
                </div>
                <div>
                    <label for="serviceDescription">Description:</label>
                    <input type="text" v-model="newService.description">
                </div>
                <button type="submit">Add Service</button>
                <button @click="toggleAddServiceForm">Cancel</button>
            </form>
        </div>

        <h2>Service Requests  View</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Service Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Customer Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Professional Name</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Date of Request</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Date of Completion</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Remarks</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Rating</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="request in serviceRequests" :key="request.request_id" style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">{{ request.request_id }}</td>
                    <td style="padding: 10px;">{{ request.service_name }}</td>
                    <td style="padding: 10px;">{{ request.customer_name }}</td>
                    <td style="padding: 10px;">{{ request.professional_name }}</td>
                    <td style="padding: 10px;">{{ request.date_of_request }}</td>
                    <td style="padding: 10px;">{{ request.date_of_completion }}</td>
                    <td style="padding: 10px;">{{ request.service_status }}</td>
                    <td style="padding: 10px;">{{ request.remarks }}</td>
                    <td style="padding: 10px;">{{ request.rating }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            users: [],
            admins: [],
            customers: [],
            professionals: [],
            services: [],
            serviceRequests: [],
            newService: {
                name: '',
                price: '',
                description: ''
            },
            editingCustomer: null,
            editingProfessional: null,
            editingService: null,
            showAddServiceForm: false
        };
    },
    created() {
        this.fetchUsers();
        this.fetchServices();
        this.fetchServiceRequests();
    },
    methods: {
        fetchUsers() {
            fetch('/users', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched users:', data);  // Debugging statement
                this.users = data;
                this.filterUsers();
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
        },
        exportServiceRequests(professionalId) {
            fetch(`/export_service_requests/${professionalId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Export job triggered') {
                    alert('Export job has been triggered.');
                    this.checkTaskStatus(data.task_id);
                } else {
                    console.error('Error triggering export job');
                }
            })
            .catch(error => {
                console.error('Error triggering export job:', error);
            });
        },
        checkTaskStatus(taskId) {
            const interval = setInterval(() => {
                fetch(`/download_csv/${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.$store.state.auth_token}`
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        clearInterval(interval);
                        const filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');
                        return response.blob().then(blob => ({ blob, filename }));
                    } else if (response.status === 202) {
                        console.log('CSV file is not ready yet');
                    } else {
                        throw new Error('Error checking task status');
                    }
                })
                .then(({ blob, filename }) => {
                    if (blob) {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                })
                .catch(error => {
                    console.error('Error downloading CSV file:', error);
                });
            }, 1000); // Check every second
        },
        fetchServices() {
            fetch('/services', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched services:', data);  // Debugging statement
                this.services = data;
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
        },
        fetchServiceRequests() {
            fetch('/service_requests', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched service requests:', data);  // Debugging statement
                this.serviceRequests = data;
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
        },
        filterUsers() {
            this.admins = this.users.filter(user => user.type === 'admin');
            this.customers = this.users.filter(user => user.type === 'customer');
            this.professionals = this.users.filter(user => user.type === 'service_professional');
        },
        deleteUser(userId) {
            fetch(`/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers(); 
                    this.fetchServiceRequests(); // Refresh the user list after deletion
                } else {
                    console.error('Error deleting user');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        },
        blockUser(userId) {
            fetch(`/users/${userId}/block`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers(); // Refresh the user list after blocking
                    this.fetchServiceRequests(); // Refresh the service requests list after blocking
                } else {
                    console.error('Error blocking user');
                }
            })
            .catch(error => {
                console.error('Error blocking user:', error);
            });
        },
        unblockUser(userId) {
            fetch(`/users/${userId}/unblock`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers(); // Refresh the user list after unblocking
                    this.fetchServiceRequests(); // Refresh the service requests list after unblocking
                } else {
                    console.error('Error unblocking user');
                }
            })
            .catch(error => {
                console.error('Error unblocking user:', error);
            });
        },
        editCustomer(customer) {
            this.editingCustomer = { ...customer };
        },
        updateCustomer() {
            fetch(`/users/${this.editingCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(this.editingCustomer)
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers();
                    this.editingCustomer = null;
                } else {
                    console.error('Error updating customer');
                }
            })
            .catch(error => {
                console.error('Error updating customer:', error);
            });
        },
        editProfessional(professional) {
            this.editingProfessional = { ...professional };
        },
        updateProfessional() {
            fetch(`/users/${this.editingProfessional.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(this.editingProfessional)
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers();
                    this.editingProfessional = null;
                } else {
                    console.error('Error updating professional');
                }
            })
            .catch(error => {
                console.error('Error updating professional:', error);
            });
        },
        approveProfessional(professionalId) {
            fetch(`/users/${professionalId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers();
                } else {
                    console.error('Error approving professional');
                }
            })
            .catch(error => {
                console.error('Error approving professional:', error);
            });
        },
        rejectProfessional(professionalId) {
            fetch(`/users/${professionalId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.fetchUsers();
                } else {
                    console.error('Error rejecting professional');
                }
            })
            .catch(error => {
                console.error('Error rejecting professional:', error);
            });
        },
        editService(service) {
            this.editingService = { ...service };
        },
        updateService() {
            fetch(`/services/${this.editingService.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(this.editingService)
            })
            .then(response => {
                if (response.ok) {
                    this.fetchServices();
                    this.editingService = null;
                } else {
                    console.error('Error updating service');
                }
            })
            .catch(error => {
                console.error('Error updating service:', error);
            });
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
                    this.fetchServices();
                } else {
                    console.error('Error deleting service');
                }
            })
            .catch(error => {
                console.error('Error deleting service:', error);
            });
        },
        addService() {
            fetch('/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(this.newService)
            })
            .then(response => response.json())
            .then(data => {
                this.services.push(data);
                this.newService.name = '';
                this.newService.price = '';
                this.newService.description = '';
                this.showAddServiceForm = false;
            })
            .catch(error => {
                console.error('Error adding service:', error);
            });
        },
        cancelEdit() {
            this.editingCustomer = null;
            this.editingProfessional = null;
            this.editingService = null;
        },
        toggleAddServiceForm() {
            this.showAddServiceForm = !this.showAddServiceForm;
        },
        viewDocument(document) {
            window.open(`/uploads/${document}`, '_blank');
        }
    }
};