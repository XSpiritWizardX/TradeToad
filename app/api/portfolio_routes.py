from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Portfolio, db

portfolio_routes = Blueprint('portfolios', __name__)

@portfolio_routes.route('/')
@login_required
def get_portfolios():
    """
    Get all portfolios for the logged-in user.
    """
    portfolios = Portfolio.query.filter_by(user_id=current_user.id).all()
    return jsonify({'portfolios': [portfolio.to_dict() for portfolio in portfolios]})

@portfolio_routes.route('/', methods=['POST'])
@login_required
def create_portfolio():
    """
    Create a new portfolio for the logged-in user.
    """
    data = request.get_json()
    name = data.get("name")
    balance = data.get("balance", 0.0)

    if not name:
        return jsonify({'error': 'Portfolio name is required'}), 400

    new_portfolio = Portfolio(user_id=current_user.id, name=name, balance=balance)
    db.session.add(new_portfolio)
    db.session.commit()

    return jsonify(new_portfolio.to_dict()), 201

@portfolio_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_portfolio(id):
    """
    Update a portfolio's balance.
    """
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()

    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404

    data = request.get_json()
    new_balance = data.get("balance")

    if new_balance is not None:
        portfolio.balance = new_balance

    db.session.commit()
    return jsonify(portfolio.to_dict())

@portfolio_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_portfolio(id):
    """
    Delete a user's portfolio.
    """
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()

    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404

    db.session.delete(portfolio)
    db.session.commit()
    return jsonify({'message': 'Portfolio deleted successfully'})
