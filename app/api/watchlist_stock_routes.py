from flask import Blueprint, request
from app.models import Watchlist_Stock, db




watchlist_stock_routes = Blueprint('watchlist_stocks', __name__, "")
