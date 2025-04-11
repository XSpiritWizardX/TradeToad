from .db import db, environment, SCHEMA, add_prefix_for_prod
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin

class Watchlist_Crypto(db.Model):
    __tablename__ = 'watchlist_cryptos'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False)
    # stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False)
    crypto_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cryptos.id")), nullable=False)

    # relationships

    watchlist = db.relationship("Watchlist", back_populates="watchlist_crypto", uselist=False)
    crypto = db.relationship("Crypto", back_populates="watchlist_cryptos")



    def to_dict(self):
        return {
            'id': self.id,
            'watchlist_id': self.watchlist_id,
            'crypto_id': self.crypto_id,
        }
