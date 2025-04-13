from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.models import Stock_Transaction, db




stock_transaction_routes = Blueprint('stock_transactions', __name__, "")






@stock_transaction_routes.route('/')
@login_required
def get_stock_transactions():
    """
    Get all stock_transactions for the logged-in user.
    """
    stock_transactions = Stock_Transaction.query.filter_by(user_id=current_user.id).all()
    return jsonify({'stock_transactions': [stock_transaction.to_dict() for stock_transaction in stock_transactions]})




@stock_transaction_routes.route('/', methods=['POST'])
@login_required
def create_stock_transaction():
    """
    Create a new stock_transaction for the logged-in user.
    """
    data = request.get_json()
    watchlist_id = data.get("watchlist_id")
    stock_id = data.get("stock_id")



    new_stock_transaction = Stock_Transaction(user_id=current_user.id, stock_id=stock_id)
    db.session.add(new_stock_transaction)
    db.session.commit()

    return jsonify(new_stock_transaction.to_dict()), 201







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
