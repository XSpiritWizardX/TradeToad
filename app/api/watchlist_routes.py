from flask import Blueprint, request
from app.models import Watchlist, db




watchlist_routes = Blueprint('watchlists', __name__, "")
