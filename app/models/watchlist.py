from .db import db, environment, SCHEMA, add_prefix_for_prod
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(50), nullable=False, default="My Watchlist")
    
    # relationships
    user = db.relationship("User", back_populates="watchlist")
    watchlist_stock = db.relationship("Watchlist_Stock", back_populates="watchlist", cascade="all, delete-orphan")
    watchlist_crypto = db.relationship("Watchlist_Crypto", back_populates="watchlist", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name, 
        }
