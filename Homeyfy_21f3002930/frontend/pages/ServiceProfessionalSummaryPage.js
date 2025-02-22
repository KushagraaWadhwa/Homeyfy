export default {
    template: `
    <div class="service-summary">
 
        <div class="charts-container">
            <div class="chart-container">
                <canvas id="ratingChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="statusChart"></canvas>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            ratings: [],
            serviceRequests: [],
        };
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
                this.serviceRequests = data;
                this.extractRatings();
                this.createStatusChart();
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
        },
        extractRatings() {
            this.ratings = this.serviceRequests
                .filter(request => request.professional_id === this.$store.state.user.id)
                .map(request => request.rating)
                .filter(rating => rating !== null);
            this.createRatingChart();
        },
        createRatingChart() {
            const ctx = document.getElementById('ratingChart').getContext('2d');
            const ratingCounts = this.ratings.reduce((counts, rating) => {
                counts[rating] = (counts[rating] || 0) + 1;
                return counts;
            }, {});

            const backgroundColors = [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ];

            const borderColors = [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)'
            ];

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(ratingCounts),
                    datasets: [{
                        label: 'Number of Ratings',
                        data: Object.values(ratingCounts),
                        backgroundColor: backgroundColors.slice(0, Object.keys(ratingCounts).length),
                        borderColor: borderColors.slice(0, Object.keys(ratingCounts).length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ratings Distribution'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        },
        createStatusChart() {
            const ctx = document.getElementById('statusChart').getContext('2d');
            const statusCounts = this.serviceRequests.reduce((counts, request) => {
                counts[request.service_status] = (counts[request.service_status] || 0) + 1;
                return counts;
            }, {});

            const backgroundColors = [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ];

            const borderColors = [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ];

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        label: 'Number of Requests',
                        data: Object.values(statusCounts),
                        backgroundColor: backgroundColors.slice(0, Object.keys(statusCounts).length),
                        borderColor: borderColors.slice(0, Object.keys(statusCounts).length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Service Request Status Distribution'
                        }
                    }
                }
                
            });
        }
    },
    mounted() {
        this.fetchServiceRequests();
    }
};



// Scoped CSS

