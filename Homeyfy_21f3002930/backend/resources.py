from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.modelss import db, User

# Create an API instance with a prefix
api = Api(prefix='/api')

# Define the fields to be serialized
user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'roles': fields.List(fields.String)
}

class UserResource(Resource):
    @auth_required('token')
    @marshal_with(user_fields)
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user

    @auth_required('token')
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

# Add the resource to the API
api.add_resource(UserResource, '/users/<int:user_id>')

# Initialize the API with the Flask app
def init_api(app):
    api.init_app(app)
    cache = app.cache

    # Apply caching to the UserResource get method
    cache.cached(timeout=60, query_string=True)(UserResource.get)
    cache.delete_memoized(UserResource.get)


# By caching the results of the UserResource.get method, the server does not need to query the database for the same user data repeatedly within the cache timeout period. This reduces the load on the server and database.
# Improved Response Times:
# Cached responses are served much faster than responses generated by querying the database and processing the data. This improves the response times for the client.