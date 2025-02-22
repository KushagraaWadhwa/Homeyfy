from flask import current_app as app, jsonify, render_template, request, send_from_directory,session
from flask_security import auth_required, verify_password, hash_password
from backend.modelss import db, User, Role, Admin, Customer, ServiceProfessional, Service, ServiceRequest
from datetime import datetime, date
import uuid
import os
from werkzeug.utils import secure_filename
from flask_login import login_user
from celery.result import AsyncResult
from backend.celery.tasks import export_service_requests_csv



datastore = app.security.datastore
cache = app.cache

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['EXPORT_FOLDER'] = os.path.join(os.path.dirname(__file__), 'exports')
os.makedirs(app.config['EXPORT_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET'])
@cache.cached(timeout=20)
def home():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "invalid inputs"}), 404
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "invalid email"}), 404
    
    if not user.active and 'service_professional' in [role.name for role in user.roles]:
        return jsonify({"message": "Your account is under approval. Please wait for the Admin to accept the request."}), 403
    else:
        if not user.active:
            return jsonify({"message": "Your account has been blocked temporarily. Please contact the Admin."}), 403
    
    if verify_password(password, user.password):
        login_user(user)
        token = user.get_auth_token()
        session['user'] = {
            'id': user.id,
            'email': user.email,
            'role': user.roles[0].name,
            'name': getattr(user, 'name', None),  # Use getattr to handle missing attributes
            'address': getattr(user, 'address', None),
            'pincode': getattr(user, 'pincode', None)
        }
        return jsonify({
            'token': token,
            'email': user.email,
            'role': user.roles[0].name,
            'id': user.id,
            'name': getattr(user, 'name', None),
            'address': getattr(user, 'address', None),
            'pincode': getattr(user, 'pincode', None),
            'active': user.active
        })
    
    return jsonify({'message': 'password wrong'}), 400

@app.route('/validate_token', methods=['POST'])
@auth_required('token')
def validate_token():
    user = session.get('user')
    if user:
        return jsonify({"valid": True, "user": user}), 200
    return jsonify({"valid": False}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/current_user', methods=['GET'])
def get_current_user():
    user = session.get('user')
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_id = user.get('id')
    user_details = User.query.get(user_id)
    
    if user_details and user_details.type == 'service_professional':
        service_professional_details = ServiceProfessional.query.get(user_id)
        if service_professional_details:
            user_details_dict = user_details.to_dict()
            user_details_dict.update({
                'service_type': service_professional_details.service_type,
                'experience': service_professional_details.experience,
                'address': service_professional_details.address,
                'document': service_professional_details.document
            })
            return jsonify(user_details_dict)
    
    return jsonify(user_details.to_dict())


@app.route('/register/customer', methods=['POST'])
def register_customer():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    pincode = data.get('pincode')

    if not email or not password or not address or not pincode:
        return jsonify({"message": "invalid inputs"}), 404
    
    user = datastore.find_user(email=email)

    if user:
        return jsonify({"message": "user already exists"}), 404

    try:
        customer_user = Customer(name=name, email=email, password=hash_password(password), fs_uniquifier=str(uuid.uuid4()), address=address, pincode=pincode)
        customer_user.roles.append(datastore.find_role('customer'))
        db.session.add(customer_user)
        db.session.commit()
        return jsonify({"message": "customer created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message": "error creating customer"}), 400

@app.route('/register/service_professional', methods=['POST'])
def register_service_professional():
    data = request.form
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    service_type = data.get('service_type')
    experience = data.get('experience')
    pincode = data.get('pincode')
    document = request.files.get('document')

    if not email or not password or not address or not service_type or not experience or not pincode or not document:
        return jsonify({"message": "invalid inputs"}), 404

    user = datastore.find_user(email=email)

    if user:
        return jsonify({"message": "user already exists"}), 404

    try:
        document_filename = secure_filename(document.filename)
        document.save(os.path.join(app.config['UPLOAD_FOLDER'], document_filename))

        professional_user = ServiceProfessional(
            name=name,
            email=email,
            password=hash_password(password),
            fs_uniquifier=str(uuid.uuid4()),
            address=address,
            service_type=service_type,
            experience=experience,
            pincode=pincode,
            document=document_filename,
            active=False  # Set active to False until approved
        )
        professional_user.roles.append(datastore.find_role('service_professional'))
        db.session.add(professional_user)
        db.session.commit()
        return jsonify({"message": "service professional registered"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "error registering service professional", "error": str(e)}), 400
    
@app.route('/admin_dashboard', methods=['GET'])
@auth_required('token')
def admin_dashboard():
    return jsonify({"message": "Welcome to the Admin Dashboard"})


@app.route('/service-professional-dashboard', methods=['GET'])
@auth_required('token')
def service_professional_dashboard():

    # Add logic to fetch and return service professional-specific data
    return jsonify({"message": "Welcome to the Service Professional Dashboard"})

@app.route('/customer-dashboard', methods=['GET'])
@auth_required('token')
def customer_dashboard():
    # Add logic to fetch and return customer-specific data
    return jsonify({"message": "Welcome to the Customer Dashboard"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Backend APIs
@app.route('/users', methods=['GET'])
@cache.cached(timeout=20)
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        email=data['email'],
        password=data['password'],
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
    for service_request in service_requests:
        db.session.delete(service_request)

    professional_requests = ServiceRequest.query.filter_by(professional_id=user_id).all()
    for professional_request in professional_requests:
        db.session.delete(professional_request)
    
    if isinstance(user, ServiceProfessional):
        document_path = os.path.join(app.config['UPLOAD_FOLDER'], user.document)
        if os.path.exists(document_path):
            os.remove(document_path)  
 
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

#Blocking a user
@app.route('/users/<int:user_id>/block', methods=['PUT'])
def block_user(user_id):
    user = User.query.get(user_id)
    if not user or not isinstance(user, Customer):
        return jsonify({'error': 'User not found or not a customer'}), 404
    user.active = False
    service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
    for service_request in service_requests:
        service_request.service_status = 'on hold'
    db.session.commit()
    return jsonify({'message': 'Customer blocked'}), 200

#Unblocking the user
@app.route('/users/<int:user_id>/unblock', methods=['PUT'])
def unblock_user(user_id):
    user = User.query.get(user_id)
    if not user or not isinstance(user, Customer):
        return jsonify({'error': 'User not found or not a customer'}), 404
    user.active = True

    # Update service requests to "requested" or appropriate status
    service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
    for service_request in service_requests:
        if service_request.service_status == 'on hold':
            service_request.service_status = 'requested'

    db.session.commit()
    return jsonify({'message': 'Customer blocked'}), 200

@app.route('/users/<int:user_id>/approve', methods=['PUT'])
def approve_professional(user_id):
    user = User.query.get(user_id)
    if not user or user.type != 'service_professional':
        return jsonify({"message": "User not found or not a service professional"}), 404

    user.active = True
    db.session.commit()
    return jsonify({"message": "Service professional approved"}), 200

@app.route('/users/<int:user_id>/reject', methods=['PUT'])
def reject_professional(user_id):
    user = User.query.get(user_id)
    if not user or user.type != 'service_professional':
        return jsonify({"message": "User not found or not a service professional"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Service professional Rejected"}), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.email = data.get('email', user.email)
    user.name = data.get('name', user.name)
    user.address = data.get('address', user.address)
    user.pincode = data.get('pincode', user.pincode)  # Update pincode
    if user.type == 'service_professional':
        user.service_type = data.get('service_type', user.service_type)
        user.experience = data.get('experience', user.experience)

    db.session.commit()
    return jsonify({"message": "User updated"}), 200



@app.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"message": "Service not found"}), 404

    data = request.json
    service.name = data.get('name', service.name)
    service.price = data.get('price', service.price)
    service.description = data.get('description', service.description)

    db.session.commit()
    return jsonify({"message": "Service updated"}), 200

# Routes for Services
@app.route('/services', methods=['GET'])
@cache.cached(timeout=20)
def get_services():
    services = Service.query.all()
    return jsonify([service.to_dict() for service in services])

@app.route('/services/<int:service_id>', methods=['GET'])
@cache.cached(timeout=20)
def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    return jsonify(service.to_dict())

@app.route('/services', methods=['POST'])
def create_service():
    data = request.json
    service = Service(
        name=data['name'],
        price=data['price'],
        description=data.get('description', '')
    )
    db.session.add(service)
    db.session.commit()
    return jsonify(service.to_dict()), 201

@app.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    
    service_requests = ServiceRequest.query.filter_by(service_id=service_id).all()
    for service_request in service_requests:
        db.session.delete(service_request)
    
    professionals = ServiceProfessional.query.filter_by(service_type=service.name).all()
    for professional in professionals:
        db.session.delete(professional)

    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service deleted'}), 200

@app.route('/service_requests', methods=['GET'])
@cache.cached(timeout=20)
def get_service_requests():
    user = session.get('user')
    if not user:
        return jsonify({"message": "User not found"}), 404

    role = user.get('role')
    user_id = user.get('id')

    if role == 'admin':
        service_requests = ServiceRequest.query.all()
    elif role == 'service_professional':
        service_requests = ServiceRequest.query.filter_by(professional_id=user_id).all()
    elif role == 'customer':
        service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
    else:
        return jsonify({"message": "Invalid role"}), 400

    return jsonify([request.to_dict() for request in service_requests])

@app.route('/service_requests/<int:request_id>', methods=['GET'], endpoint='get_service_request')
def get_service_request(request_id):
    service_request = ServiceRequest.query.get(request_id)
    if not service_request:
        return jsonify({'error': 'Service Request not found'}), 404
    return jsonify(service_request.to_dict())

@app.route('/service_requests', methods=['POST'], endpoint='create_service_request')
def create_service_request():
    data = request.json
    service_request = ServiceRequest(
        service_id=data['service_id'],
        customer_id=data['customer_id'],
        professional_id=data.get('professional_id'),
        remarks=data.get('remarks'),
        rating=data.get('rating'),
        service_status=data.get('service_status', 'requested')
    )
    db.session.add(service_request)
    db.session.commit()
    return jsonify(service_request.to_dict()), 201

@app.route('/service_requests/<int:request_id>/close', methods=['PUT'], endpoint='close_service_request')
def close_service_request(request_id):
    data = request.get_json()
    service_request = ServiceRequest.query.get(request_id)
    if service_request:
        service_request.service_status = 'closed'
        date_of_completion_str = data.get('date_of_completion')
        if date_of_completion_str:
            try:
                service_request.date_of_completion = datetime.strptime(date_of_completion_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400
        service_request.remarks = data.get('remarks')
        service_request.rating = data.get('rating')
        db.session.commit()
        return jsonify({
            'success': True,
            'data': service_request.to_dict()  # Ensure to_dict() includes necessary fields
        }), 200
    return jsonify({'error': 'Service request not found'}), 404

@app.route('/service_requests/<int:request_id>', methods=['DELETE'], endpoint='delete_service_request')
def delete_service_request(request_id):
    service_request = ServiceRequest.query.get(request_id)
    if service_request:
        db.session.delete(service_request)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Service request deleted',
            'request_id': request_id
        }), 200
    return jsonify({'error': 'Service request not found'}), 404

@app.route('/service_requests/<int:request_id>/update_status', methods=['POST'], endpoint='update_service_request_status')
def update_service_request_status(request_id):
    data = request.json
    service_request = ServiceRequest.query.get(request_id)
    if not service_request:
        return jsonify({"message": "Service request not found"}), 404

    service_request.service_status = data.get('service_status', service_request.service_status)
    db.session.commit()
    return jsonify(service_request.to_dict()), 200

@app.before_request
def clear_cache():
    if request.method in ['POST', 'PUT', 'DELETE']:
        cache.clear()
        
@app.route('/export_service_requests/<int:professional_id>', methods=['POST'])
def trigger_export_service_requests(professional_id):
    task = export_service_requests_csv.delay(professional_id)
    return jsonify({'message': 'Export job triggered', 'task_id': task.id}), 200

@app.route('/download_csv/<task_id>', methods=['GET'])
def download_csv(task_id):
    result = export_service_requests_csv.AsyncResult(task_id)
    if result.state == 'SUCCESS':
        csv_path = result.result
        directory = os.path.dirname(csv_path)
        filename = os.path.basename(csv_path)
        return send_from_directory(directory, filename, as_attachment=True)
    else:
        return jsonify({'message': 'CSV file is not ready yet'}), 202


if __name__ == '__main__':
    app.run(debug=True)


