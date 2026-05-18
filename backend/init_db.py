from app import create_app, db
from app import models  # CRITICAL

app = create_app()

with app.app_context():
    print("Dropping & creating tables...")

    db.drop_all()   # optional but CLEAN reset
    db.create_all()

    print("DONE: tables created")