import csv
import os
import time
from flask import current_app as app, render_template
from celery import shared_task
from backend.modelss import db, ServiceRequest, ServiceProfessional,Customer
from backend.celery.mail_service import send_email

@shared_task(ignore_result=False)
def export_service_requests_csv(professional_id, *args, **kwargs):
    with app.app_context():
        professional = ServiceProfessional.query.get(professional_id)
        closed_requests = ServiceRequest.query.filter_by(professional_id=professional.id, service_status='closed').all()
        csv_file = f"{professional.name}_closed_requests.csv"
        csv_path = os.path.join(app.config['EXPORT_FOLDER'], csv_file)
        
        # Ensure the exports directory exists
        if not os.path.exists(app.config['EXPORT_FOLDER']):
            os.makedirs(app.config['EXPORT_FOLDER'])
        
        with open(csv_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Service ID', 'Customer ID', 'Professional ID', 'Date of Request', 'Date of Completion', 'Remarks', 'Rating'])
            for request in closed_requests:
                writer.writerow([request.request_id, request.customer_id, request.professional_id, request.date_of_request, request.date_of_completion, request.remarks, request.rating])
        
        while not os.path.exists(csv_path) or os.path.getsize(csv_path) == 0:
            time.sleep(0.1)

        subject = 'Closed Service Requests Export'
        content = 'The export of closed service requests is complete. Please find the CSV file attached.'
        send_email(professional.email, subject, content, csv_path)
        
        return csv_path
    
@shared_task(ignore_result=True)
def email_reminder():
    with app.app_context():
        professionals = ServiceProfessional.query.all()
        for professional in professionals:
            pending_requests = ServiceRequest.query.filter_by(professional_id=professional.id, service_status='pending').all()
            if pending_requests:
                subject = 'Daily Reminder: Pending Service Requests'
                content = f'Dear {professional.name},\n\nYou have pending service requests. Please visit the platform to accept or reject them.\n\nBest regards,\nHomeyfy Team. HOpe you have a greate day ahead!:)'
                send_email(professional.email, subject, content)

@shared_task(ignore_result=True)
def send_monthly_activity_report():
    with app.app_context():
        customers = Customer.query.all()
        for customer in customers:
            service_requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()
            closed_requests = [req for req in service_requests if req.service_status == 'closed']
            pending_requests = [req for req in service_requests if req.service_status in ['pending', 'requested']]
            accepted_requests = [req for req in service_requests if req.service_status == 'accepted']
            
            subject = 'Monthly Activity Report'
            html_content = f"""
            <html>
                <body>
                    <h1>Monthly Activity Report</h1>
                    <p>Dear {customer.name},</p>
                    <p>Here is your activity report for the month:</p>
                    
                    <h2>Closed Requests</h2>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Service ID</th>
                                <th>Service Name</th>
                                <th>Date of Request</th>
                                <th>Date of Completion</th>
                                <th>Remarks</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f'<tr><td>{req.request_id}</td><td>{req.service.name}</td><td>{req.date_of_request.strftime("%Y-%m-%d")}</td><td>{req.date_of_completion.strftime("%Y-%m-%d") if req.date_of_completion else "N/A"}</td><td>{req.remarks}</td><td>{req.rating}</td></tr>' for req in closed_requests)}
                        </tbody>
                    </table>
                    
                    <h2>Pending Requests</h2>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Service ID</th>
                                <th>Service Name</th>
                                <th>Date of Request</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f'<tr><td>{req.request_id}</td><td>{req.service.name}</td><td>{req.date_of_request.strftime("%Y-%m-%d")}</td><td>{req.service_status}</td></tr>' for req in pending_requests)}
                        </tbody>
                    </table>
                    
                    <h2>Accepted Requests</h2>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Service ID</th>
                                <th>Service Name</th>
                                <th>Date of Request</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f'<tr><td>{req.request_id}</td><td>{req.service.name}</td><td>{req.date_of_request.strftime("%Y-%m-%d")}</td></tr>' for req in accepted_requests)}
                        </tbody>
                    </table>
                    
                    <p>Best regards,<br>Homeyfy Team</p>
                </body>
            </html>
            """
            send_email(customer.email, subject, html_content)
