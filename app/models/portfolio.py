from .db import db, environment, SCHEMA, add_prefix_for_prod

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    total_cash = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)
    available_cash = db.Column(db.Numeric(precision=15, scale=2), nullable=False)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_cash': self.total_cash,
            'available_cash': self.available_cash,
        }
