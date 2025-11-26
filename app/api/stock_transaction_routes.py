from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import (
    Portfolio,
    Portfolio_Stock,
    Stock,
    Stock_Transaction,
    db,
)
from app.services.pricing import get_latest_price


stock_transaction_routes = Blueprint("stock_transactions", __name__, "")






@stock_transaction_routes.route('/')
@login_required
def get_stock_transactions():
    """
    Get all stock_transactions for the logged-in user.
    """
    stock_transactions = Stock_Transaction.query.options(joinedload(Stock_Transaction.stock))\
        .filter_by(user_id=current_user.id).all()
    return jsonify(
        {
            "stock_transactions": [
                stock_transaction.to_dict() for stock_transaction in stock_transactions
            ]
        }
    )




@stock_transaction_routes.route('/', methods=['POST'])
@login_required
def create_stock_transaction():
    """
    Create a new stock_transaction for the logged-in user.
    """
    data = request.get_json()
    stock_id = data.get("stock_id")
    shares = data.get("shares")
    price = data.get("price")
    action = data.get("action", "BUY").upper()

    if not stock_id or shares is None:
        return jsonify({"error": "stock_id and shares are required"}), 400

    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({"error": "Stock not found"}), 404

    # Validate numbers
    try:
        shares_dec = Decimal(str(shares))
    except (InvalidOperation, TypeError):
        return jsonify({"error": "Invalid shares value"}), 400

    # Use provided price or fetch latest
    price_val = price
    if price_val is None:
        price_val = get_latest_price(stock.symbol)
    try:
        price_dec = Decimal(str(price_val))
    except (InvalidOperation, TypeError):
        return jsonify({"error": "Price unavailable"}), 503

    # Ensure user portfolio exists
    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    if not portfolio:
        return jsonify({"error": "No portfolio for user"}), 400

    if action == "BUY":
        cost = shares_dec * price_dec
        available = Decimal(str(portfolio.available_cash or 0))
        if cost > available:
            return jsonify({"error": "Insufficient available cash"}), 400
        portfolio.available_cash = available - cost

        # upsert holding
        holding = Portfolio_Stock.query.filter_by(
            portfolio_id=portfolio.id, stock_id=stock.id
        ).first()
        if holding:
            holding.quantity = Decimal(str(holding.quantity or 0)) + shares_dec
        else:
            holding = Portfolio_Stock(
                portfolio_id=portfolio.id, stock_id=stock.id, quantity=shares_dec
            )
            db.session.add(holding)
    elif action == "SELL":
        holding = Portfolio_Stock.query.filter_by(
            portfolio_id=portfolio.id, stock_id=stock.id
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

    new_stock_transaction = Stock_Transaction(
        user_id=current_user.id,
        stock_id=stock_id,
        shares=shares_dec,
        price=price_dec,
        action=action,
    )
    db.session.add(new_stock_transaction)
    db.session.commit()

    resp = new_stock_transaction.to_dict()
    resp["symbol"] = stock.symbol
    resp["portfolio"] = portfolio.to_dict()
    return jsonify(resp), 201







@stock_transaction_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_stock_transaction(id):
    """
    Delete a user's stock_transaction.
    """
    stock_transaction = Stock_Transaction.query.filter_by(id=id, user_id=current_user.id).first()

    if not stock_transaction:
        return jsonify({'error': 'Watchlist_Stock not found'}), 404

    db.session.delete(stock_transaction)
    db.session.commit()
    return jsonify({'message': 'Stock_Transaction deleted successfully'})
