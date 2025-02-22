import sys
import os
from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.modelss import db, User, Role
from backend.resources import api
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_caching import Cache
from flask_cors import CORS
import flask_excel as excel
from flask_caching import Cache
from backend.create_initial_data import create_initial_data
from backend.celery.celery_factory import celery_init_app


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)
    
    #model init
    db.init_app(app)
    CORS(app)

    # Initialize cache
    cache = Cache(app)

    # Initialize  flask-restful 
    from backend.resources import api
    api.init_app(app)

    # Initialize Flask-Security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache

    app.security = Security(app, datastore=datastore,register_blueprint=False)
    # Push the application context
    app.app_context().push()

    return app

app = create_app()
celery_app=celery_init_app(app)


# Import routes
import backend.routes

import backend.celery.celery_schedule
# Initialize Flask-Excel
excel.init_excel(app)

db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'database.sqlite3')
if not os.path.exists(db_path):
    create_initial_data(app)

if not os.path.exists(app.config['EXPORT_FOLDER']):
    os.makedirs(app.config['EXPORT_FOLDER'])


if __name__ == '__main__':
    app.run(debug=True)