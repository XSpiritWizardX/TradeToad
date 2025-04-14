from flask import Blueprint, jsonify, request
from app.models import Stock, db
from app.api.polygon.client import apiCall


stock_routes = Blueprint('stocks', __name__, "")


# works good
@stock_routes.route('/')
def get_stocks():
    """
    Get all stocks.
    """
    stocks = Stock.query.all()
    return jsonify({'stocks': [stock.to_dict() for stock in stocks]})


@stock_routes.route('/<symbol>')
def get_stock(symbol):
    """
    Get stock prices by stock symbol.
    """
    result = apiCall(symbol)
    return jsonify(result)
    # return jsonify({'stocks': [stock.to_dict() for stock in stocks]})