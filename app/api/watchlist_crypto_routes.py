from flask import Blueprint, request
from app.models import Watchlist_Crypto, db




watchlist_crypto_routes = Blueprint('watchlist_cryptos', __name__, "")
