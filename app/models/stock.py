from .db import db, environment, SCHEMA, add_prefix_for_prod
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin

class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(5), nullable=False)
    company = db.Column(db.String(40), nullable=False)
    market_cap = db.Column(db.Integer(), nullable=False)

    # Relationships
    portfolio_stocks = db.relationship("Portfolio_Stock", back_populates="stock", cascade="all, delete-orphan")
    watchlist_stocks = db.relationship("Watchlist_Stock", back_populates="stock", cascade="all, delete-orphan")
    stock_transactions = db.relationship("Stock_Transaction", back_populates="stock", cascade="all, delete-orphan")



    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'company': self.company,
            'market_cap': self.market_cap,
        }
