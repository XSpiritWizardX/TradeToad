from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import Portfolio, Portfolio_Stock, db




portfolio_stock_routes = Blueprint('portfolio_stocks', __name__, "")


# works good
@portfolio_stock_routes.route('/')
@login_required
def get_portfolio_stocks():
    """
    Get all portfolio_stocks for the logged-in user.
    """
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'portfolio_stocks': []})

    portfolio_stocks = Portfolio_Stock.query.options(joinedload(Portfolio_Stock.stock))\
        .filter_by(portfolio_id=portfolio.id).all()
    return jsonify({'portfolio_stocks': [portfolio_stock.to_dict() for portfolio_stock in portfolio_stocks]})




@portfolio_stock_routes.route('/', methods=['POST'])
@login_required
def create_portfolio_stock():
    """
    Create a new portfolio_stock for the logged-in user.
    """
    data = request.get_json()
    portfolio_id = data.get("portfolio_id")
    stock_id = data.get("stock_id")
    quantity = data.get("quantity")

    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found for user'}), 404

    new_portfolio_stock = Portfolio_Stock(portfolio_id=portfolio_id, stock_id=stock_id, quantity=quantity)
    db.session.add(new_portfolio_stock)
    db.session.commit()

    return jsonify(new_portfolio_stock.to_dict()), 201




@portfolio_stock_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_portfolio_stock(id):
    """
    Update a portfolio_stock's quantity.
    """
    portfolio_stock = Portfolio_Stock.query.get(id)

    if not portfolio_stock or portfolio_stock.portfolio.user_id != current_user.id:
        return jsonify({'error': 'Portfolio_Stock not found'}), 404

    data = request.get_json()
    new_quantity = data.get("quantity")

    if new_quantity is not None:
        portfolio_stock.quantity = new_quantity

    db.session.commit()
    return jsonify(portfolio_stock.to_dict())




@portfolio_stock_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_portfolio_stock(id):
    """
    Delete a user's portfolio_stock.
    """
    portfolio_stock = Portfolio_Stock.query.get(id)

    if not portfolio_stock or portfolio_stock.portfolio.user_id != current_user.id:
        return jsonify({'error': 'Portfolio_Stock not found'}), 404

    db.session.delete(portfolio_stock)
    db.session.commit()
    return jsonify({'message': 'Portfolio_Stock deleted successfully'})
