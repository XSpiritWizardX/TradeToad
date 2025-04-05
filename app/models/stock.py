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


    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'company': self.company,
            'market_cap': self.market_cap,
        }
