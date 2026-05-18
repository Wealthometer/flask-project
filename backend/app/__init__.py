from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# initialize extensions
db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    load_dotenv()

    app = Flask(__name__)

    # config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "this-is-a-super-secure-secret-key-32plus-chars-long-2026"

    # init extensions
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # import models (VERY IMPORTANT)
    from app import models

    # register routes
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")

    # test route
    @app.route("/")
    def home():
        return {"message": "API is running"}

    return app