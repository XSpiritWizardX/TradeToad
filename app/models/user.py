from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# these imports not needed?
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.schema import Column, ForeignKey
# from sqlalchemy.types import Integer, String
# from sqlalchemy.orm import relationship

# Base / declarative_base not needed?
# Base = declarative_base()

# class User(Base, UserMixin):
class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(40), nullable=False)
    lastName = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    # Relationships 
    watchlist = db.relationship("Watchlist", back_populates="user", cascade="all, delete-orphan", uselist=False)
    portfolio = db.relationship("Portfolio", back_populates="user", cascade="all, delete-orphan", uselist=False)
    stock_transactions = db.relationship("Stock_Transaction", back_populates="user", cascade="all, delete-orphan")
    # in watchlist & portfolio relationships, uselist=False limits 1 per user
    # add these tables later:
    # crypto_transactions = db.relationship("Crypto_Transaction", back_populates="user", cascade="all, delete-orphan")
    # creditcards = db.relationship("CreditCard", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'username': self.username,
            'email': self.email
        }
