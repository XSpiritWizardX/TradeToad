from .db import db, environment, SCHEMA, add_prefix_for_prod


class Crypto_Transaction(db.Model):
    __tablename__ = "crypto_transactions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    # stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id")), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    crypto_id = db.Column(db.Integer, nullable=False)
    shares = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)
    price = db.Column(db.Numeric(precision=15, scale=2, asdecimal=True), nullable=False)
    action = db.Column(db.String(4), nullable=False)

    # Relationships
    # user = db.relationship("User", back_populates="stock_transactions")
    # stock = db.relationship("Stock", back_populates="stock_transactions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "crypto_id": self.crypto_id,
            "shares": self.shares,
            "price": self.price,
            "action": self.action,
        }
