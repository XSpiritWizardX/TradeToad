from flask import Blueprint, jsonify, request
from app.models import Crypto, db




crypto_routes = Blueprint('cryptos', __name__, "")





# works good
@crypto_routes.route('/')
def get_cryptos():
    """
    Get all cryptos.
    """
    cryptos = Crypto.query.all()
    return jsonify({'cryptos': [crypto.to_dict() for crypto in cryptos]})
