from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from app.extensions import db
from app.scheduler import start_scheduler

jwt = JWTManager()


def create_app():
    load_dotenv()

    app = Flask(__name__)

    # CONFIG
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-me")

    # INIT EXTENSIONS
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # IMPORT MODELS (SAFE WAY)

    with app.app_context():
        from app import models

    
    # REGISTER ROUTES
    from app.routes.auth_routes import auth_bp
    from app.routes.scholarship_routes import scholarship_bp
    from app.routes.match_routes import match_bp
    from app.routes.scrape_routes import scrape_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(scholarship_bp, url_prefix="/api")
    app.register_blueprint(match_bp, url_prefix="/api")
    app.register_blueprint(scrape_bp, url_prefix="/api")

    
    # START SCHEDULER (LAST STEP)
    
    start_scheduler(app)

    # HOME ROUTE
    @app.route("/")
    def home():
        return {"message": "API is running"}

    return app