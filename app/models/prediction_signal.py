from datetime import datetime

from .db import db, environment, SCHEMA, add_prefix_for_prod


class PredictionSignal(db.Model):
    __tablename__ = "prediction_signals"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(15), nullable=False, index=True)
    predicted_for = db.Column(db.DateTime, nullable=True)
    timespan = db.Column(db.String(20), nullable=True)
    multiplier = db.Column(db.Integer, nullable=True)
    span_days = db.Column(db.Integer, nullable=True)
    action = db.Column(db.String(10), nullable=True)
    confidence = db.Column(db.Float, nullable=True)
    predicted_price = db.Column(db.Float, nullable=True)
    last_price = db.Column(db.Float, nullable=True)
    mae = db.Column(db.Float, nullable=True)
    model_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "symbol": self.symbol,
            "predicted_for": self.predicted_for.isoformat() if self.predicted_for else None,
            "timespan": self.timespan,
            "multiplier": self.multiplier,
            "span_days": self.span_days,
            "action": self.action,
            "confidence": self.confidence,
            "predicted_price": self.predicted_price,
            "last_price": self.last_price,
            "mae": self.mae,
            "model_used": self.model_used,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
