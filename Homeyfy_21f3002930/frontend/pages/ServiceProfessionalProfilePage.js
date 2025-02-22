import ServiceProfessionalNavbar from '../components/ServiceProfessionalNavbar.js';

export default {
    components: {
        ServiceProfessionalNavbar
    },
    data() {
        return {
            userDetails: null, // Initialize as null to handle loading state
            updateMessage: '',
            isEditing: false // Flag for edit mode
        };
    },
    template: `
    <div>
        <div class="container mt-5">
            <h1 class="text-center mb-4">Your Profile</h1>
            <div v-if="updateMessage" class="alert alert-info mt-4">{{ updateMessage }}</div>
            <div v-if="!userDetails" class="text-center">
                <p>Loading profile details...</p>
            </div>
            <div v-else>
                <div v-if="!isEditing">
                    <div class="card">
                        <div class="card-body">
                            <p><strong>Name:</strong> {{ userDetails.name }}</p>
                            <p><strong>Email:</strong> {{ userDetails.email }}</p>
                            <p><strong>Address:</strong> {{ userDetails.address }}</p>
                            <p><strong>Pincode:</strong> {{ userDetails.pincode }}</p>
                            <p><strong>Service Type:</strong> {{ userDetails.service_type }}</p>
                            <p><strong>Experience:</strong> {{ userDetails.experience }} years</p>
                            <p><strong>Description:</strong> {{ userDetails.description }}</p>
                            <p><strong>Document:</strong> 
                                <a :href="'/uploads/' + userDetails.document" target="_blank">View Document</a>
                            </p>
                            <button class="btn btn-primary" @click="editProfile">Edit Profile</button>
                        </div>
                    </div>
                </div>  
                <div v-else class="container mt-4">
                    <h2>Edit Your Profile</h2>
                    <form @submit.prevent="updateProfile">
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" v-model="userDetails.name" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" v-model="userDetails.email" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="address">Address:</label>
                            <input type="text" v-model="userDetails.address" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="pincode">Pincode:</label>
                            <input type="text" v-model="userDetails.pincode" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="description">Description:</label>
                            <textarea v-model="userDetails.description" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="service_type">Service Type:</label>
                            <input type="text" v-model="userDetails.service_type" class="form-control" disabled />
                        </div>
                        <div class="form-group">
                            <label for="experience">Experience (years):</label>
                            <input type="number" v-model="userDetails.experience" class="form-control" disabled />
                        </div>
                        <button type="submit" class="btn btn-success">Update</button>
                        <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        editProfile() {
            this.isEditing = true;
        },
        updateProfile() {
            const userId = this.userDetails.id;
            fetch(`/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                },
                body: JSON.stringify(this.userDetails)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error updating profile');
                }
            })
            .then(data => {
                this.$store.commit('setUser', data); // Update the Vuex store with the new user details
                this.updateMessage = 'Your Profile has been updated successfully.';
                this.isEditing = false;
                setTimeout(() => {
                    this.updateMessage = '';
                }, 4000); 
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
        },
        cancelEdit() {
            this.loadUserDetails(); 
            this.isEditing = false;
        },
        loadUserDetails() {
            fetch('/current_user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.$store.state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching user details');
                }
            })
            .then(data => {
                this.userDetails = data;
                this.$store.commit('setUser', data);
            })
            .catch(error => {
                console.error('Error loading user details:', error);
            });
        }
    },
    created() {
        this.loadUserDetails();
    }
};