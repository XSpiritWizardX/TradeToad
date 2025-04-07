from .db import db, environment, SCHEMA, add_prefix_for_prod
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False, unique=True)
    # unique=True to enforce one watchlist per user

    # Relationships
    watchlist_stocks = db.relationship("Watchlist_Stock", back_populates="watchlist", cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="watchlist")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
        }
