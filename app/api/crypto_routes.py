from flask import Blueprint, request
from app.models import Crypto, db




crypto_routes = Blueprint('cryptos', __name__, "")
