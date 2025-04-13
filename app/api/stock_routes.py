from flask import Blueprint, jsonify, request
from app.models import Stock, db




stock_routes = Blueprint('stocks', __name__, "")




# works good
@stock_routes.route('/')
def get_stocks():
    """
    Get all stocks.
    """
    stocks = Stock.query.all()
    return jsonify({'stocks': [stock.to_dict() for stock in stocks]})




