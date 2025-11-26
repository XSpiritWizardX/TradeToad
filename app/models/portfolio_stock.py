from .db import db, environment, SCHEMA, add_prefix_for_prod

class Portfolio_Stock(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    # stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)

    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("portfolios.id")), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)
    quantity = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)

    # Relationships
    portfolio = db.relationship("Portfolio", back_populates="portfolio_stock", uselist=False)
    stock = db.relationship("Stock", back_populates="portfolio_stocks")

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'stock_id': self.stock_id,
            'quantity': float(self.quantity),
            # 'stock': self.stock.to_dict()  # Include stock details
        }
    # NOTE line 24: "Include stock details" is not in schema diagram
    # Is this stock details going to add redundant data to table?
    # Will stock details page need to use this 'stock' details column?
