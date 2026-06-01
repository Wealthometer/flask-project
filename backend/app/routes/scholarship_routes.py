from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Scholarship

scholarship_bp = Blueprint("scholarship", __name__)


# CREATE SCHOLARSHIP
@scholarship_bp.route("/scholarships", methods=["POST"])
def create_scholarship():

    data = request.get_json()

    scholarship = Scholarship(
        title=data.get("title"),
        provider=data.get("provider"),
        country=data.get("country"),
        degree_level=data.get("degree_level"),
        eligibility=data.get("eligibility"),
        description=data.get("description"),
        deadline=data.get("deadline"),
        application_link=data.get("application_link")
    )

    db.session.add(scholarship)
    db.session.commit()

    return jsonify({"message": "Scholarship created"}), 201


# GET ALL SCHOLARSHIPS
@scholarship_bp.route("/scholarships", methods=["GET"])
def get_scholarships():

    scholarships = Scholarship.query.all()

    result = []

    for s in scholarships:
        result.append({
            "id": s.id,
            "title": s.title,
            "provider": s.provider,
            "country": s.country,
            "degree_level": s.degree_level,
        })

    return jsonify(result), 200


# GET SINGLE SCHOLARSHIP
@scholarship_bp.route("/scholarships/<int:id>", methods=["GET"])
def get_scholarship(id):

    s = Scholarship.query.get(id)

    if not s:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "id": s.id,
        "title": s.title,
        "provider": s.provider,
        "country": s.country,
        "degree_level": s.degree_level,
        "eligibility": s.eligibility,
        "description": s.description,
        "deadline": str(s.deadline),
        "application_link": s.application_link
    }), 200