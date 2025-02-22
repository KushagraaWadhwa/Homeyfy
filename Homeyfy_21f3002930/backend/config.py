import os
class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'thisshouldbekeptsecret'
    SECRET_KEY = "shouldbekeyveryhidden"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization'
    SECURITY_JOIN_USER_ROLES = True  
    SECURITY_PASSWORD_SINGLE_HASH = {"plaintext"}  


    CACHE_TYPE =  "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379

    WTF_CSRF_ENABLED = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    EXPORT_FOLDER = os.path.join(os.path.dirname(__file__), 'exports')
