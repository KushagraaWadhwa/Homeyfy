const store = new Vuex.Store({
    state: {
        user:{
            email: '',
        },
        auth_token: null,
        role: null,
        loggedIn: false,
        user_id: null,
        user_details: null,  // Add user_details to store user information
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.auth_token = user.token;
            state.role = user.role;
            state.loggedIn = true;
            state.user_id = user.id;
            state.user_details = user;  // Store user details
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout(state) {
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            state.user_details = null;  
            localStorage.removeItem('user');
        },
        loadUserFromStorage(state) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                state.auth_token = user.token;
                state.role = user.role;
                state.loggedIn = true;
                state.user_id = user.id;
                state.user_details = user;
            }
        }
    },
    actions: {
        fetchCurrentUser({ commit, state }) {
            fetch('/current_user', {
                headers: {
                    'Authorization': `Bearer ${state.auth_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                commit('setUser', data);
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
            });
        },
        logout({ commit, state }) {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.auth_token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    commit('logout');
                } else {
                    console.error('Error logging out');
                }
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
        }
    },
    getters: {
        isAuthenticated: state => !!state.auth_token,
        userRole: state => state.role,
        userDetails: state => state.user_details,  // Add getter for user details
    }
});

store.commit('loadUserFromStorage');

export default store;