import uuid
import os
from datetime import datetime
from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from werkzeug.utils import secure_filename
from backend.modelss import db, User, Role, Admin, Customer, ServiceProfessional, Service, ServiceRequest
from backend.config import LocalDevelopmentConfig


def create_initial_data(app):
    with app.app_context():
        db.create_all()

        userdatastore = app.security.datastore

        userdatastore.find_or_create_role(name='admin', description='Superuser')
        userdatastore.find_or_create_role(name='customer', description='General user')
        userdatastore.find_or_create_role(name='service_professional', description='Service professional')

        if not userdatastore.find_user(email='admin@hmail.com'):
            admin_user = Admin(email='admin@hmail.com', password=hash_password('pass'), fs_uniquifier=str(uuid.uuid4()), active=True, pincode='110077')
            admin_user.roles.append(userdatastore.find_role('admin'))
            db.session.add(admin_user)
        
        if not userdatastore.find_user(email='user1@hmail.com'):
            customer_user = Customer(name='Chris', email='user01@hmail.com', password=hash_password('pass'), fs_uniquifier=str(uuid.uuid4()), address='123 Main St', pincode='110065', active=True)
            customer_user.roles.append(userdatastore.find_role('customer'))
            db.session.add(customer_user)
        
        if not userdatastore.find_user(email='user2@hmail.com'):
            customer_user = Customer(name='Alex', email='user02@hmail.com', password=hash_password('pass'), fs_uniquifier=str(uuid.uuid4()), address='456 Oak St', pincode='110090', active=True)
            customer_user.roles.append(userdatastore.find_role('customer'))
            db.session.add(customer_user)
        
        if not userdatastore.find_user(email='user3@hmail.com'):
            customer_user = Customer(name='Sam', email='user03@hmail.com', password=hash_password('pass'), fs_uniquifier=str(uuid.uuid4()), address='789 Pine St', pincode='110091', active=True)
            customer_user.roles.append(userdatastore.find_role('customer'))
            db.session.add(customer_user)
        
        upload_folder = os.path.join(os.path.dirname(__file__), 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        document_1 = 'document1.pdf'
        document_2 = 'document2.pdf'
        document_3 = 'document3.pdf'
        document_4 = 'document4.pdf'
        document_5 = 'document5.pdf'
        document_6 = 'document6.pdf'
        document_7 = 'document7.pdf'
        document_8 = 'document8.pdf'
        document_9 = 'document9.pdf'
        document_10 = 'document10.pdf'
        document_11 = 'document11.pdf'
        document_12 = 'document12.pdf'
        document_13 = 'document13.pdf'
        document_14 = 'document14.pdf'
        document_15 = 'document15.pdf'
        document_16 = 'document16.pdf'
        document_17 = 'document17.pdf'
        document_18 = 'document18.pdf'

        # Save example documents in the upload folder
        for i in range(1, 19):
            with open(os.path.join(upload_folder, f'document{i}.pdf'), 'w') as f:
                f.write(f'This is a sample document for service professional {i}.')

        # Create service professionals
        service_professionals = [
            {
                'email': 'service1@hmail.com',
                'password': 'pass',
                'name': 'John Doe',
                'service_type': 'Plumbing',
                'experience': 5,
                'address': '456 Elm St',
                'pincode': '110082',
                'document': document_1,
                'description': 'Basic plumbing services',
                'active': False
            },
            {
                'email': 'service2@hmail.com',
                'password': 'pass',
                'name': 'Jane Smith',
                'service_type': 'Plumbing',
                'experience': 8,
                'address': '789 Pine St',
                'pincode': '110067',
                'document': document_2,
                'description': 'Advanced plumbing services',
                'active': True
            },
            {
                'email': 'service3@hmail.com',
                'password': 'pass',
                'name': 'Mike Johnson',
                'service_type': 'Carpentry',
                'experience': 10,
                'address': '101 Maple St',
                'pincode': '110072',
                'document': document_3,
                'description': 'Furniture carpentry',
                'active': True
            },
            {
                'email': 'service4@hmail.com',
                'password': 'pass',
                'name': 'Alice Brown',
                'service_type': 'Carpentry',
                'experience': 3,
                'address': '202 Oak St',
                'pincode': '110083',
                'document': document_4,
                'description': 'Structural carpentry',
                'active': True
            },
            {
                'email': 'service5@hmail.com',
                'password': 'pass',
                'name': 'Bob White',
                'service_type': 'Electrical',
                'experience': 7,
                'address': '303 Birch St',
                'pincode': '110084',
                'document': document_5,
                'description': 'Basic switchboard electrician',
                'active': True
            },
            {
                'email': 'service6@hmail.com',
                'password': 'pass',
                'name': 'Charlie Green',
                'service_type': 'Electrical',
                'experience': 6,
                'address': '404 Cedar St',
                'pincode': '110085',
                'document': document_6,
                'description': 'Heavy appliance electrician',
                'active': True
            },
            {
                'email': 'service7@hmail.com',
                'password': 'pass',
                'name': 'David Black',
                'service_type': 'Gardening',
                'experience': 4,
                'address': '505 Walnut St',
                'pincode': '110086',
                'document': document_7,
                'description': 'Basic gardening services',
                'active': True
            },
            {
                'email': 'service8@hmail.com',
                'password': 'pass',
                'name': 'Eve Blue',
                'service_type': 'Gardening',
                'experience': 9,
                'address': '606 Chestnut St',
                'pincode': '110087',
                'document': document_8,
                'description': 'Advanced gardening services',
                'active': True
            },
            {
                'email': 'service9@hmail.com',
                'password': 'pass',
                'name': 'Frank Yellow',
                'service_type': 'Driver',
                'experience': 11,
                'address': '707 Spruce St',
                'pincode': '110088',
                'document': document_9,
                'description': 'Personal driver',
                'active': True
            },
            {
                'email': 'service10@hmail.com',
                'password': 'pass',
                'name': 'Grace Red',
                'service_type': 'Driver',
                'experience': 5,
                'address': '808 Willow St',
                'pincode': '110089',
                'document': document_10,
                'description': 'Commercial driver',
                'active': True
            },
            {
                'email': 'service11@hmail.com',
                'password': 'pass',
                'name': 'Hank Purple',
                'service_type': 'Caretaker',
                'experience': 6,
                'address': '909 Fir St',
                'pincode': '110090',
                'document': document_11,
                'description': 'Elderly caretaker',
                'active': True
            },
            {
                'email': 'service12@hmail.com',
                'password': 'pass',
                'name': 'Ivy Orange',
                'service_type': 'Caretaker',
                'experience': 7,
                'address': '1010 Ash St',
                'pincode': '110091',
                'document': document_12,
                'description': 'Child caretaker',
                'active': True
            },
            {
                'email': 'service13@hmail.com',
                'password': 'pass',
                'name': 'Jack Pink',
                'service_type': 'Cleaning',
                'experience': 3,
                'address': '1111 Poplar St',
                'pincode': '110092',
                'document': document_13,
                'description': 'Residential cleaning',
                'active': True
            },
            {
                'email': 'service14@hmail.com',
                'password': 'pass',
                'name': 'Kara Grey',
                'service_type': 'Cleaning',
                'experience': 4,
                'address': '1212 Cypress St',
                'pincode': '110093',
                'document': document_14,
                'description': 'Commercial cleaning',
                'active': True
            },
            {
                'email': 'service15@hmail.com',
                'password': 'pass',
                'name': 'Liam Brown',
                'service_type': 'Painting',
                'experience': 8,
                'address': '1313 Redwood St',
                'pincode': '110094',
                'document': document_15,
                'description': 'Interior painting',
                'active': True
            },
            {
                'email': 'service16@hmail.com',
                'password': 'pass',
                'name': 'Mia White',
                'service_type': 'Painting',
                'experience': 9,
                'address': '1414 Sequoia St',
                'pincode': '110095',
                'document': document_16,
                'description': 'Exterior painting',
                'active': True
            },
            {
                'email': 'service17@hmail.com',
                'password': 'pass',
                'name': 'Noah Black',
                'service_type': 'Cooking',
                'experience': 5,
                'address': '1515 Magnolia St',
                'pincode': '110096',
                'document': document_17,
                'description': 'Home cook',
                'active': True
            },
            {
                'email': 'service18@hmail.com',
                'password': 'pass',
                'name': 'Olivia Blue',
                'service_type': 'Cooking',
                'experience': 6,
                'address': '1616 Palm St',
                'pincode': '110097',
                'document': document_18,
                'description': 'Professional chef',
                'active': True
            }
        ]

        for sp in service_professionals:
            if not userdatastore.find_user(email=sp['email']):
                service_professional_user = ServiceProfessional(
                    email=sp['email'],
                    password=hash_password(sp['password']),
                    fs_uniquifier=str(uuid.uuid4()),
                    name=sp['name'],
                    service_type=sp['service_type'],
                    experience=sp['experience'],
                    address=sp['address'],
                    pincode=sp['pincode'],
                    document=sp['document'],
                    description=sp['description'],
                    active=sp['active']
                )
                service_professional_user.roles.append(userdatastore.find_role('service_professional'))
                db.session.add(service_professional_user)

        db.session.commit()

        # Create example services
        services = [
            {'name': 'Plumbing', 'price': 100.0, 'description': 'Plumbing services'},
            {'name': 'Carpentry', 'price': 150.0, 'description': 'Carpentry services'},
            {'name': 'Electrical', 'price': 200.0, 'description': 'Electrical services'},
            {'name': 'Gardening', 'price': 50.0, 'description': 'Gardening services'},
            {'name': 'Driver', 'price': 500.0, 'description': 'Driver services'},
            {'name': 'Caretaker', 'price': 300.0, 'description': 'Caretaker services'},
            {'name': 'Cleaning', 'price': 80.0, 'description': 'Cleaning services'},
            {'name': 'Painting', 'price': 250.0, 'description': 'Painting services'},
            {'name': 'Cooking', 'price': 120.0, 'description': 'Cooking services'}
        ]

        for service in services:
            db.session.add(Service(name=service['name'], price=service['price'], description=service['description']))

        db.session.commit()

if __name__ == '__main__':
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    security = Security(app, SQLAlchemyUserDatastore(db, User, Role))
    create_initial_data(app)