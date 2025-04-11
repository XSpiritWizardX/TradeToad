from .db import db, environment, SCHEMA, add_prefix_for_prod
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin

class Crypto(db.Model):
    __tablename__ = 'cryptos'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(5), nullable=False)
    company = db.Column(db.String(40), nullable=False)
    market_cap = db.Column(db.Numeric(precision=20, scale=2, asdecimal=True), nullable=False)

    # Relationships
    portfolio_cryptos = db.relationship("Portfolio_Crypto", back_populates="crypto", cascade="all, delete-orphan")
    watchlist_cryptos = db.relationship("Watchlist_Crypto", back_populates="crypto", cascade="all, delete-orphan")
    crypto_transactions = db.relationship("Crypto_Transaction", back_populates="crypto", cascade="all, delete-orphan")



    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'company': self.company,
            'market_cap': self.market_cap,
        }
