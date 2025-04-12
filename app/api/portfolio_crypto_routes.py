from flask import Blueprint, request
from app.models import Portfolio_Crypto, db




portfolio_crypto_routes = Blueprint('portfolio_cryptos', __name__, "")
