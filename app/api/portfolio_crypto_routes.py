from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import Portfolio, Portfolio_Crypto, db


portfolio_crypto_routes = Blueprint('portfolio_cryptos', __name__, "")





# wroks good
@portfolio_crypto_routes.route('/')
@login_required
def get_portfolio_cryptos():
    """
    Get all portfolio_cryptos for the logged-in user.
    """
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'portfolio_cryptos': []})

    portfolio_cryptos = Portfolio_Crypto.query.options(joinedload(Portfolio_Crypto.crypto))\
        .filter_by(portfolio_id=portfolio.id).all()
    return jsonify({'portfolio_cryptos': [portfolio_crypto.to_dict() for portfolio_crypto in portfolio_cryptos]})




@portfolio_crypto_routes.route('/', methods=['POST'])
@login_required
def create_portfolio_crypto():
    """
    Create a new portfolio_crypto for the logged-in user.
    """
    data = request.get_json()
    portfolio_id = data.get("portfolio_id")
    crypto_id = data.get("crypto_id")
    quantity = data.get("quantity")

    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found for user'}), 404

    new_portfolio_crypto = Portfolio_Crypto(portfolio_id=portfolio_id, crypto_id=crypto_id, quantity=quantity)
    db.session.add(new_portfolio_crypto)
    db.session.commit()

    return jsonify(new_portfolio_crypto.to_dict()), 201




@portfolio_crypto_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_portfolio_crypto(id):
    """
    Update a portfolio_crypto's quantity.
    """
    portfolio_crypto = Portfolio_Crypto.query.get(id)

    if not portfolio_crypto or portfolio_crypto.portfolio.user_id != current_user.id:
        return jsonify({'error': 'Portfolio_Crypto not found'}), 404

    data = request.get_json()
    new_quantity = data.get("quantity")

    if new_quantity is not None:
        portfolio_crypto.quantity = new_quantity

    db.session.commit()
    return jsonify(portfolio_crypto.to_dict())




@portfolio_crypto_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_portfolio_crypto(id):
    """
    Delete a user's portfolio_crypto.
    """
    portfolio_crypto = Portfolio_Crypto.query.get(id)

    if not portfolio_crypto or portfolio_crypto.portfolio.user_id != current_user.id:
        return jsonify({'error': 'Portfolio_Crypto not found'}), 404

    db.session.delete(portfolio_crypto)
    db.session.commit()
    return jsonify({'message': 'Portfolio_Crypto deleted successfully'})
