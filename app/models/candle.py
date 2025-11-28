from datetime import datetime

from .db import db, environment, SCHEMA


class Candle(db.Model):
    __tablename__ = "candles"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(15), index=True, nullable=False)
    timestamp = db.Column(db.BigInteger, index=True, nullable=False)  # ms epoch
    open = db.Column(db.Float, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.Float, nullable=True)
    timespan = db.Column(db.String(10), nullable=True)  # minute, hour, day
    source = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "symbol": self.symbol,
            "timestamp": self.timestamp,
            "open": self.open,
            "high": self.high,
            "low": self.low,
            "close": self.close,
            "volume": self.volume,
            "timespan": self.timespan,
            "source": self.source,
        }
