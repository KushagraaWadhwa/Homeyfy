import ServiceProfessionalNavbar from '../components/ServiceProfessionalNavbar.js';

export default {
    components: {
        ServiceProfessionalNavbar
    },
    data() {
        return {
            serviceRequests: [],
            pendingRequests: [],
            acceptedRequests: [],
            closedRequests: [],
            serviceType: '', // This will be dynamically set based on the logged-in professional
            showUpdateForm: false,
            allUsers: [],
            updateMessage: '',
            searchQuery: '', // Add search query to data
        };
    },
    computed: {
        userDetails() {
            return this.$store.getters.userDetails;
        },
        filteredPendingRequests() {
            return this.pendingRequests.filter(request => this.filterRequest(request));
        },
        filteredAcceptedRequests() {
            return this.acceptedRequests.filter(request => this.filterRequest(request));
        },
        filteredClosedRequests() {
            return this.closedRequests.filter(request => this.filterRequest(request));
        }
    },
    template: `
    <div>
        <div class="container mt-5">
            <h1 class="text-center mb-4">Service Professional Dashboard</h1>
            <router-link to="/service-professional-dashboard/profile" class="btn btn-secondary mb-3">View/Edit Profile</router-link>
            <input type="text" v-model="searchQuery" placeholder="Search service requests" class="form-control mb-4" />

            <h2 class="mt-4">Pending Service Requests</h2>
            <div v-if="filteredPendingRequests.length === 0" class="alert alert-info text-center">
                <p>No pending requests at the moment.</p>
            </div>
            <table v-else class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Customer Name</th>
                        <th>Date of Request</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in filteredPendingRequests" :key="request.request_id" :class="getStatusClass(request.service_status)">
                        <td>{{ request.request_id }}</td>
                        <td>{{ request.service_name }}</td>
                        <td>{{ request.customer_name }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ getStatusText(request.service_status) }}</td>
                        <td>
                            <button class="btn btn-success btn-sm" @click="acceptRequest(request)" :disabled="request.service_status === 'accepted'">Accept</button>
                            <button class="btn btn-danger btn-sm" @click="rejectRequest(request)" :disabled="request.service_status === 'Rejected'">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 class="mt-4">Accepted Service Requests</h2>
            <div v-if="filteredAcceptedRequests.length === 0" class="alert alert-info text-center">
                <p>No accepted requests at the moment.</p>
            </div>
            <table v-else class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Customer Name</th>
                        <th>Date of Request</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in filteredAcceptedRequests" :key="request.request_id" :class="getStatusClass(request.service_status)">
                        <td>{{ request.request_id }}</td>
                        <td>{{ request.service_name }}</td>
                        <td>{{ request.customer_name }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ getStatusText(request.service_status) }}</td>
                    </tr>
                </tbody>
            </table>

            <h2 class="mt-4">Closed Service Requests</h2>
            <div v-if="filteredClosedRequests.length === 0" class="alert alert-info text-center">
                <p>No closed requests at the moment.</p>
            </div>
            <table v-else class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Customer Name</th>
                        <th>Date of Request</th>
                        <th>Date of Completion</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in filteredClosedRequests" :key="request.request_id">
                        <td>{{ request.request_id }}</td>
                        <td>{{ request.service_name }}</td>
                        <td>{{ request.customer_name }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ request.date_of_completion }}</td>
                        <td>{{ getStatusText(request.service_status) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    created() {
        this.$store.commit('loadUserFromStorage');
        this.fetchServiceRequests();
    },
    methods: {
        fetchServiceRequests() {
            // Fetch service requests related to the professional's ID
            fetch(`/service_requests?professional_id=${this.userDetails.id}`, {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.serviceRequests = data;
                this.filterRequests();
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
        },
        filterRequests() {
            this.pendingRequests = this.serviceRequests.filter(request => request.service_status === 'requested' || request.service_status === 'on hold');
            this.acceptedRequests = this.serviceRequests.filter(request => request.service_status === 'accepted');
            this.closedRequests = this.serviceRequests.filter(request => request.service_status === 'closed');
        },
        acceptRequest(request) {
            if (request.service_status === 'on hold') {
                alert('The user has been blocked by the admin. You cant accept the request currently.');
                return;
            }
            request.service_status = 'accepted';
            this.updateRequestStatus(request);
        },
        rejectRequest(request) {
            request.service_status = 'Rejected';
            this.updateRequestStatus(request);
        },
        updateRequestStatus(request) {
            fetch(`/service_requests/${request.request_id}/update_status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify({ service_status: request.service_status })
            })
            .then(response => response.json())
            .then(data => {
                this.fetchServiceRequests();
            })
            .catch(error => {
                console.error('Error updating request status:', error);
            });
        },
        getStatusClass(status) {
            if (status === 'accepted') return 'table-success';
            if (status === 'requested') return 'table-warning';
            if (status === 'on hold') return 'table-danger';
            return ''; // Default class for closed and other statuses
        },
        getStatusText(status) {
            if (status === 'accepted') return 'Accepted';
            if (status === 'closed') return 'Closed';
            if (status === 'on hold') return 'On Hold';
            return 'Pending';
        },
        filterRequest(request) {
            const query = this.searchQuery.toLowerCase();
            return (
                request.service_name.toLowerCase().includes(query) ||
                request.customer_name.toLowerCase().includes(query) ||
                request.date_of_request.toLowerCase().includes(query) ||
                request.service_status.toLowerCase().includes(query)
            );
        }
    }
};