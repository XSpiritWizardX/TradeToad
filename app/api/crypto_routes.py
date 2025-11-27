from flask import Blueprint, jsonify, request
from app.models import Crypto, db
from app.api.polygon.client import apiCall



crypto_routes = Blueprint('cryptos', __name__, "")





# works good
@crypto_routes.route('/')
def get_cryptos():
    """
    Get all cryptos.
    """
    cryptos = Crypto.query.all()
    return jsonify({'cryptos': [crypto.to_dict() for crypto in cryptos]})





# This becomes /api/cryptos/<symbol>
@crypto_routes.route('/<symbol>')
def get_crypto(symbol):
    """
    Get crypto prices by crypto symbol.
    """
    days = request.args.get('days', default=90, type=int)
    multiplier = request.args.get('multiplier', default=1, type=int)
    timespan = request.args.get('timespan', default="day", type=str)
    result = apiCall(symbol, span_days=days, multiplier=multiplier, timespan=timespan)
    return jsonify(result)
