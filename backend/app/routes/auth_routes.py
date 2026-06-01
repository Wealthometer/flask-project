from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from app.models import User

auth_bp = Blueprint("auth", __name__)



# REGISTER USER
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    # validation
    if not full_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # check if user exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # hash password
    hashed_password = generate_password_hash(password)

    # create user
    new_user = User(
        full_name=full_name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


# LOGIN USER
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # check password
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # create JWT token
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200

from flask_jwt_extended import jwt_required, get_jwt_identity


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_text": user.profile_text,
        "created_at": user.created_at
    }), 200


@auth_bp.route("/profile/text", methods=["PUT"])
@jwt_required()
def update_profile_text():
    user_id = get_jwt_identity()
    data = request.get_json()
    profile_text = data.get("profile_text")

    if profile_text is None:
        return jsonify({"error": "Profile text is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.profile_text = profile_text
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "profile_text": user.profile_text
    }), 200