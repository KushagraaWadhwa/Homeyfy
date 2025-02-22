# Household Services Management System ~ "Homeyfy"

## Overview
Homeyfy is a web-based multi-user application designed to streamline household services. It acts as a platform connecting service professionals and customers, managed by an admin, to provide comprehensive home servicing solutions.

## Features
- **Role-Based Access Control (RBAC)**: Three user roles - Admin, Service Professional, and Customer.
- **User Management**: Admin can manage users and approve professionals.
- **Service Management**: Admin can create, update, and delete services.
- **Service Requests**: Customers can search for services, request them, and track their progress.
- **Service Acceptance/Rejection**: Professionals can view, accept/reject, and complete service requests.
- **Caching & Async Jobs**: Redis caching and Celery tasks for improved performance.
- **Scheduled Jobs & Notifications**: Automatic daily reminders and monthly activity reports.

## Tech Stack
- **Backend**: Flask, Flask-Security (RBAC), Flask-SQLAlchemy (ORM)
- **Database**: SQLite
- **Frontend**: Vue.js
- **Caching**: Redis
- **Background Tasks**: Celery
- **Email Services**: Flask-Mail, MailHog (for testing)

## Architecture
- **Backend (Flask API)**: Handles authentication, service management, and user interactions.
- **Database (SQLite)**: Stores users, services, and service requests.
- **Frontend (Vue.js)**: Renders the user interfaces for Admin, Professionals, and Customers.
- **Caching (Redis)**: Improves API performance by storing frequently accessed data.
- **Async Tasks (Celery + Redis)**: Manages scheduled tasks such as reminders and activity reports.

## API Endpoints
- **Authentication**:
  - `/login` - User login
  - `/register` - New user registration
- **Admin Actions**:
  - `/admin/dashboard` - Manage users and services
- **Service Management**:
  - `/services` - CRUD operations for services
- **Service Requests**:
  - `/service-requests` - Create, update, and close requests

## Future Enhancements
- Real-time notifications using WebSockets.
- ML-based matching of service professionals.
- Optimized database queries for large-scale operations.
- Enhanced UI and performance improvements.
- Payment gateway integration.
- Customer loyalty programs and discounts.

## Demo
[Watch the presentation video](https://drive.google.com/file/d/1B8M62IEN44I0p9CK1iU0echyviY1qu-q/view?usp=sharing)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/homeyfy.git
   cd homeyfy
   ```
2. Create a virtual environment and install dependencies:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Set up environment variables and run the Flask server:
   ```sh
   export FLASK_APP=app.py
   flask run
   ```
4. Start Redis and Celery for background tasks:
   ```sh
   redis-server &
   celery -A app.celery worker --loglevel=info
   ```



