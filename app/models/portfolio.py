from .db import db, environment, SCHEMA, add_prefix_for_prod

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(50), nullable=False)  
    total_cash = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)
    available_cash = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)


     # Relationships
    user = db.relationship("User", back_populates="portfolio")
    portfolio_stock = db.relationship("Portfolio_Stock", back_populates="portfolio", cascade="all, delete-orphan")
    portfolio_crypto = db.relationship("Portfolio_Crypto", back_populates="portfolio", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'total_cash': float(self.total_cash),
            'available_cash': float(self.available_cash),
        }
