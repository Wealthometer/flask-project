from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    profile_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Scholarship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    provider = db.Column(db.String(255))
    country = db.Column(db.String(100))
    degree_level = db.Column(db.String(100))
    eligibility = db.Column(db.Text)
    description = db.Column(db.Text)
    deadline = db.Column(db.Date)
    application_link = db.Column(db.Text)


class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    scholarship_id = db.Column(db.Integer)
    similarity_score = db.Column(db.Float)
    matched_at = db.Column(db.DateTime, default=datetime.utcnow)