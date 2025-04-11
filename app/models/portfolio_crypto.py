from .db import db, environment, SCHEMA, add_prefix_for_prod

class Portfolio_Crypto(db.Model):
    __tablename__ = 'portfolio_cryptos'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    # crypto_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cryptos.id")), nullable=False)

    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    crypto_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cryptos.id")), nullable=False)

    quantity = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)

    # Relationships
    portfolio = db.relationship("Portfolio", back_populates="portfolio_crypto", uselist=False)
    crypto = db.relationship("Crypto", back_populates="portfolio_cryptos")

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'crypto_id': self.crypto_id,
            'quantity': self.quantity,
            # 'stock': self.stock.to_dict()  # Include stock details
        }
