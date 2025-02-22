from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import uuid

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    roles = db.relationship('Role', backref='bearers', secondary='user_roles')
    type = db.Column(db.String(50))
    pincode = db.Column(db.String, nullable=False)  # New field for pincode

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'active': self.active,
            'roles': [role.name for role in self.roles],
            'type': self.type,
            'pincode': self.pincode

        }

class Admin(User):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String, nullable=True)  # Add name attribute
    active = db.Column(db.Boolean, default=True)

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }

    def to_dict(self):
        return super().to_dict()

class ServiceProfessional(User):
    __tablename__ = 'service_professional'
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String)
    service_type = db.Column(db.String, nullable=False)
    experience = db.Column(db.Integer)  
    active = db.Column(db.Boolean, default=False)
    address = db.Column(db.String, nullable=False)
    document = db.Column(db.String(255), nullable=False)
    service_requests = db.relationship('ServiceRequest', backref='professional', lazy=True)

    __mapper_args__ = {
        'polymorphic_identity': 'service_professional',
    }

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'name': self.name,
            'date_created': self.date_created.strftime('%Y-%m-%d') if self.date_created else None,
            'description': self.description,
            'service_type': self.service_type,
            'experience': self.experience,
            'address': self.address,
            'active': self.active,
            'document': self.document
        })
        return data

class Customer(User):
    __tablename__ = 'customer'
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean, default=True)

    service_requests = db.relationship('ServiceRequest', backref='customer', lazy=True)

    __mapper_args__ = {
        'polymorphic_identity': 'customer',
    }

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'name': self.name,
            'address': self.address
        })
        return data

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String)
    service_requests = db.relationship('ServiceRequest', backref='service', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description
        }

class ServiceRequest(db.Model):
    request_id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('service_professional.id'),   nullable=False)
    date_of_request = db.Column(db.DateTime, default=datetime.utcnow)
    date_of_completion = db.Column(db.DateTime)
    service_status = db.Column(db.String, default='requested')  # requested/assigned/closed
    remarks = db.Column(db.String)
    rating=db.Column(db.Integer)

    def to_dict(self):
        return {
            'request_id': self.request_id,
            'service_id': self.service_id,
            'customer_id': self.customer_id,
            'professional_id': self.professional_id,
            'date_of_request': self.date_of_request.strftime('%Y-%m-%d') if self.date_of_request else None,
            'date_of_completion': self.date_of_completion.strftime('%Y-%m-%d') if self.date_of_completion else None,
            'service_status': self.service_status,
            'remarks': self.remarks,
            'rating': self.rating,
            'service_name': self.service.name if self.service else None,
            'customer_name': self.customer.name if self.customer else None,
            'professional_name': self.professional.name if self.professional else None
        }