import CustomerNavbar from '../components/CustomerNavbar.js';

export default {
    components: {
        CustomerNavbar
    },
    data() {
        return {
            serviceRequests: [],
            currentRequests: [],
            closedRequests: [],
            rating: '',  // Add a property to store the rating
            remarks: ''  // Add a property to store the remarks (feedback)
        };
    },
    computed: {
        userDetails() {
            return this.$store.getters.userDetails;
        }
    },
    template: `
    <div>
        <div class="container mt-5">
            <h2 class="text-center mb-4">Current Active Service Requests</h2>
            <div v-if="currentRequests.length == 0" class="alert alert-info text-center">
                <p>No Active Requests at the moment</p>
            </div>
            <table v-else class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Professional Name</th>
                        <th>Date of Request</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in currentRequests" :key="request.request_id" :class="getStatusClass(request.service_status)">
                        <td>{{ request.request_id }}</td>
                        <td>{{ request.service_name }}</td>
                        <td>{{ request.professional_name }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ getStatusText(request.service_status) }}</td>
                        <td>
                            <button v-if="request.service_status.toLowerCase() === 'accepted'" class="btn btn-success btn-sm" @click="closeRequest(request)">Close?</button>
                            <button v-if="request.service_status.toLowerCase() === 'requested'" class="btn btn-danger btn-sm" @click="terminateRequest(request.request_id)">Cancel Request</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2 class="text-center my-4">Closed Service Requests</h2>
            <div v-if="closedRequests.length === 0" class="alert alert-info text-center">
                <p>You have no Service History with us!!</p>
            </div>
            <table v-else class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Professional Name</th>
                        <th>Date of Request</th>
                        <th>Date of Completion</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in closedRequests" :key="request.request_id" :class="getStatusClass(request.service_status)">
                        <td>{{ request.request_id }}</td>
                        <td>{{ request.service_name }}</td>
                        <td>{{ request.professional_name }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ request.date_of_completion }}</td>
                        <td>{{ getStatusText(request.service_status) }}</td>
                        <td>{{ request.rating }}</td>
                        <td>{{ request.remarks }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    created() {
        this.fetchServiceRequests();
    },
    methods: {
        fetchServiceRequests() {
            fetch('/service_requests', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                const customerId = this.userDetails.id;
                this.serviceRequests = data;
                this.currentRequests = data.filter(request => request.customer_id === customerId && request.service_status.toLowerCase() !== 'closed' && request.service_status.toLowerCase() !== 'rejected');
                this.closedRequests = data.filter(request => request.customer_id === customerId && (request.service_status.toLowerCase() === 'closed' || request.service_status.toLowerCase() === 'rejected'));
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
        },
        closeRequest(request) {
            const rating = prompt('Please rate the service (1-5):');
            const remarks = prompt('Please provide your feedback:');
            if (rating && remarks) {
                fetch(`/service_requests/${request.request_id}/close`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$store.state.auth_token}`
                    },
                    body: JSON.stringify({ rating, remarks, service_status: 'closed', date_of_completion: new Date().toISOString().split('T')[0] })
                })
                .then(response => {
                    if (response.ok) {
                        this.fetchServiceRequests();  // Refresh the service requests
                    } else {
                        throw new Error('Error closing service request');
                    }
                })
                .catch(error => {
                    console.error('Error closing service request:', error);
                });
            }
        },
        terminateRequest(requestId) {
            if (confirm('Are you sure you want to terminate this service request?')) {
                fetch(`/service_requests/${requestId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.$store.state.auth_token}`
                    }
                })
                .then(response => {
                    if (response.ok) {
                        this.fetchServiceRequests();  // Refresh the service requests
                    } else {
                        throw new Error('Error terminating service request');
                    }
                })
                .catch(error => {
                    console.error('Error terminating service request:', error);
                });
            }
        },
        getStatusClass(status) {
            if (status.toLowerCase() === 'accepted') return 'table-success';
            if (status.toLowerCase() === 'requested') return 'table-warning';
            if (status.toLowerCase() === 'rejected') return 'table-danger';
            return '';
        },
        getStatusText(status) {
            if (status.toLowerCase() === 'accepted') return 'Assigned';
            if (status.toLowerCase() === 'requested') return 'Requested';
            if (status.toLowerCase() === 'rejected') return 'Rejected';
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
    }
};