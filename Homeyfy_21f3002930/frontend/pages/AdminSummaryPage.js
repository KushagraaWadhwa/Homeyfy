export default {
    name: 'AdminSummaryPage',
    template: `
    <div>
        <div class="summary-counters">
            <div class="counter">
                <h2>Total Customers</h2>
                <p>{{ totalCustomers }}</p>
            </div>
            <div class="counter">
                <h2>Total Service Professionals</h2>
                <p>{{ totalServiceProfessionals }}</p>
            </div>
            <div class="counter">
                <h2>Total Services</h2>
                <p>{{ totalServices }}</p>
            </div>
            <div class="counter">
                <h2>Total Service Requests</h2>
                <p>{{ totalServiceRequests }}</p>
            </div>
        </div>
        <div class="charts-container">
            <div class="chart-container">
                <canvas id="statusChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="typeChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="professionalStatusChart"></canvas>
            </div>
        </div>
        <div class="charts-container">
            <div class="chart-container">
                <canvas id="professionalsPerServiceChart"></canvas>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            totalCustomers: 0,
            totalServiceProfessionals: 0,
            totalServices: 0,
            totalServiceRequests: 0,
            serviceRequests: [],
            users: [],
            services: [],
            professionalsPerService: {}
        };
    },
    mounted() {
        this.fetchSummaryData();
    },
    methods: {
        fetchSummaryData() {
            Promise.all([
                fetch('/users').then(response => response.json()),
                fetch('/services').then(response => response.json()),
                fetch('/service_requests').then(response => response.json())
            ])
            .then(([users, services, serviceRequests]) => {
                this.users = users;
                this.services = services;
                this.totalCustomers = users.filter(user => user.roles.includes('customer')).length;
                this.totalServiceProfessionals = users.filter(user => user.roles.includes('service_professional')).length;
                this.totalServices = services.length;
                this.totalServiceRequests = serviceRequests.length;
                this.serviceRequests = serviceRequests;
                this.calculateProfessionalsPerService();
                this.createCharts();
            })
            .catch(error => {
                console.error('Error fetching summary data:', error);
            });
        },
        calculateProfessionalsPerService() {
            this.professionalsPerService = this.services.reduce((counts, service) => {
                counts[service.name] = this.users.filter(user => user.roles.includes('service_professional') && user.service_type === service.name).length;
                return counts;
            }, {});
        },
        createCharts() {
            const statusCounts = this.serviceRequests.reduce((counts, request) => {
                counts[request.service_status] = (counts[request.service_status] || 0) + 1;
                return counts;
            }, {});

            const typeCounts = this.serviceRequests.reduce((counts, request) => {
                counts[request.service_name] = (counts[request.service_name] || 0) + 1;
                return counts;
            }, {});

            const professionalStatusCounts = this.users.reduce((counts, user) => {
                if (user.roles.includes('service_professional')) {
                    counts[user.active ? 'Accepted' : 'Pending'] = (counts[user.active ? 'Accepted' : 'Pending'] || 0) + 1;
                }
                return counts;
            }, {});

            const professionalsPerService = this.services.reduce((counts, service) => {
                counts[service.name] = this.users.filter(user => user.roles.includes('service_professional') && user.service_type === service.name).length;
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

            this.createChart('statusChart', 'doughnut', Object.keys(statusCounts), Object.values(statusCounts), backgroundColors, borderColors, 'Service Request Status Distribution');
            this.createChart('typeChart', 'bar', Object.keys(typeCounts), Object.values(typeCounts), backgroundColors, borderColors, 'Service Request Type Distribution');
            this.createChart('professionalStatusChart', 'bar', Object.keys(professionalStatusCounts), Object.values(professionalStatusCounts), backgroundColors, borderColors, 'Service Professional Status');
            this.createChart('professionalsPerServiceChart', 'bar', Object.keys(professionalsPerService), Object.values(professionalsPerService), backgroundColors, borderColors, 'Number of Professionals per Service');
        },
        createChart(chartId, chartType, labels, data, backgroundColors, borderColors, title) {
            const ctx = document.getElementById(chartId).getContext('2d');
            new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: title
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
        }
    }
};