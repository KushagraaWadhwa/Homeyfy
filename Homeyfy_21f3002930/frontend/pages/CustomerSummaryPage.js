export default {
    template: `
    <div>
        <div class="charts-container">
            <div class="chart-container">
                <canvas id="statusChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="typeChart"></canvas>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
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
                this.createCharts();
            })
            .catch(error => {
                console.error('Error fetching service requests:', error);
            });
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

            this.createChart('statusChart', 'doughnut', Object.keys(statusCounts), Object.values(statusCounts), backgroundColors, borderColors);
            this.createChart('typeChart', 'bar', Object.keys(typeCounts), Object.values(typeCounts), backgroundColors, borderColors);
        },
        createChart(chartId, chartType, labels, data, backgroundColors, borderColors) {
            const ctx = document.getElementById(chartId).getContext('2d');
            new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Requests',
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
                            text: chartId === 'statusChart' ? 'Service Request Status Distribution' : 'Service Request Type Distribution'
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
    },
    mounted() {
        this.fetchServiceRequests();
    }
};