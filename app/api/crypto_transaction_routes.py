from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Crypto_Transaction, db




crypto_transaction_routes = Blueprint('crypto_transactions', __name__, "")






@crypto_transaction_routes.route('/')
@login_required
def get_crypto_transactions():
    """
    Get all crypto_transactions for the logged-in user.
    """
    crypto_transactions = Crypto_Transaction.query.filter_by(user_id=current_user.id).all()
    return jsonify({'crypto_transactions': [crypto_transaction.to_dict() for crypto_transaction in crypto_transactions]})




@crypto_transaction_routes.route('/', methods=['POST'])
@login_required
def create_crypto_transaction():
    """
    Create a new crypto_transaction for the logged-in user.
    """
    data = request.get_json()
    watchlist_id = data.get("watchlist_id")
    crypto_id = data.get("crypto_id")



    new_crypto_transaction = Crypto_Transaction(user_id=current_user.id, crypto_id=crypto_id)
    db.session.add(new_crypto_transaction)
    db.session.commit()

    return jsonify(new_crypto_transaction.to_dict()), 201







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
