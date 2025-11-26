from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Portfolio, db
from app.services.portfolio_summary import build_portfolio_summary

portfolio_routes = Blueprint('portfolios', __name__)


@portfolio_routes.route('/')
@login_required
def get_portfolios():
    """
    Get all portfolios for the logged-in user.
    """
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'portfolios': []})
    return jsonify({'portfolios': [portfolio.to_dict()]})


@portfolio_routes.route('/summary')
@login_required
def get_portfolio_summary():
    """
    Return the single portfolio with valuations and holdings breakdown.
    """
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'portfolio': None}), 404
    summary = build_portfolio_summary(portfolio)
    return jsonify({'portfolio': summary})


@portfolio_routes.route('/<int:id>')
@login_required
def get_portfolio(id):
    """
    Get a portfolio by ID for the logged-in user.
    """
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
        
    return jsonify(portfolio.to_dict())


@portfolio_routes.route('/', methods=['POST'])
@login_required
def create_portfolio():
    """
    Create a new portfolio for the logged-in user.
    """
    existing = Portfolio.query.filter_by(user_id=current_user.id).first()
    if existing:
        return jsonify(existing.to_dict()), 200

    data = request.get_json()
    name = data.get("name")
    total_cash = data.get("total_cash", 0.00)
    available_cash = data.get("available_cash", 0.00)

    if not name:
        return jsonify({'error': 'Portfolio name is required'}), 400

    new_portfolio = Portfolio(user_id=current_user.id, name=name, total_cash=total_cash, available_cash=available_cash)
    db.session.add(new_portfolio)
    db.session.commit()

    return jsonify(new_portfolio.to_dict()), 201


@portfolio_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_portfolio(id):
    """
    Update a portfolio's total_cash.
    """
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()

    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404

    data = request.get_json()
    
    new_total_cash = data.get('total_cash')
    new_available_cash = data.get('available_cash')
    new_name = data.get('name')

    if new_total_cash is not None:
        portfolio.total_cash = new_total_cash

    if new_available_cash is not None:
        portfolio.available_cash = new_available_cash
        
    if new_name is not None:
        portfolio.name = new_name

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
