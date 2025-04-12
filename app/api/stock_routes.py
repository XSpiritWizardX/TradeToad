from flask import Blueprint, request
from app.models import Stock, db




stock_routes = Blueprint('stocks', __name__, "")
