from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import (
    Crypto,
    Crypto_Transaction,
    Portfolio,
    Portfolio_Crypto,
    db,
)
from app.services.pricing import get_latest_price


crypto_transaction_routes = Blueprint('crypto_transactions', __name__, "")


@crypto_transaction_routes.route('/')
@login_required
def get_crypto_transactions():
    """
    Get all crypto_transactions for the logged-in user.
    """
    crypto_transactions = Crypto_Transaction.query.options(joinedload(Crypto_Transaction.crypto))\
        .filter_by(user_id=current_user.id).all()
    return jsonify({'crypto_transactions': [crypto_transaction.to_dict() for crypto_transaction in crypto_transactions]})


@crypto_transaction_routes.route('/', methods=['POST'])
@login_required
def create_crypto_transaction():
    """
    Create a new crypto_transaction for the logged-in user.
    """
    data = request.get_json()
    crypto_id = data.get("crypto_id")
    shares = data.get("shares")
    price = data.get("price")
    action = (data.get("action") or "BUY").upper()

    if not crypto_id or shares is None:
        return jsonify({"error": "crypto_id and shares are required"}), 400

    crypto = Crypto.query.get(crypto_id)
    if not crypto:
        return jsonify({"error": "Crypto not found"}), 404

    try:
        shares_dec = Decimal(str(shares))
    except (InvalidOperation, TypeError):
        return jsonify({"error": "Invalid shares value"}), 400

    price_val = price if price is not None else get_latest_price(crypto.symbol)
    try:
        price_dec = Decimal(str(price_val))
    except (InvalidOperation, TypeError):
        return jsonify({"error": "Price unavailable"}), 503

    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({"error": "No portfolio for user"}), 400

    if action == "BUY":
        cost = shares_dec * price_dec
        available = Decimal(str(portfolio.available_cash or 0))
        if cost > available:
            return jsonify({"error": "Insufficient available cash"}), 400
        portfolio.available_cash = available - cost

        holding = Portfolio_Crypto.query.filter_by(
            portfolio_id=portfolio.id, crypto_id=crypto.id
        ).first()
        if holding:
            holding.quantity = Decimal(str(holding.quantity or 0)) + shares_dec
        else:
            holding = Portfolio_Crypto(
                portfolio_id=portfolio.id, crypto_id=crypto.id, quantity=shares_dec
            )
            db.session.add(holding)
    elif action == "SELL":
        holding = Portfolio_Crypto.query.filter_by(
            portfolio_id=portfolio.id, crypto_id=crypto.id
        ).first()
        if not holding:
            return jsonify({"error": "No holdings to sell"}), 400
        current_qty = Decimal(str(holding.quantity or 0))
        if shares_dec > current_qty:
            return jsonify({"error": "Sell quantity exceeds holdings"}), 400
        holding.quantity = current_qty - shares_dec
        proceeds = shares_dec * price_dec
        portfolio.available_cash = Decimal(str(portfolio.available_cash or 0)) + proceeds
        if holding.quantity == 0:
            db.session.delete(holding)
    else:
        return jsonify({"error": "Unsupported action"}), 400

    new_crypto_transaction = Crypto_Transaction(
        user_id=current_user.id,
        crypto_id=crypto_id,
        shares=shares_dec,
        price=price_dec,
        action=action,
    )
    db.session.add(new_crypto_transaction)
    db.session.commit()

    resp = new_crypto_transaction.to_dict()
    resp["symbol"] = crypto.symbol
    resp["portfolio"] = portfolio.to_dict()
    return jsonify(resp), 201


@crypto_transaction_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_crypto_transaction(id):
    """
    Delete a user's crypto_transaction.
    """
    crypto_transaction = Crypto_Transaction.query.filter_by(id=id, user_id=current_user.id).first()

    if not crypto_transaction:
        return jsonify({'error': 'Watchlist_Stock not found'}), 404

    db.session.delete(crypto_transaction)
    db.session.commit()
    return jsonify({'message': 'Crypto_Transaction deleted successfully'})
