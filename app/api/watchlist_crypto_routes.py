from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import Watchlist, Watchlist_Crypto, db




watchlist_crypto_routes = Blueprint('watchlist_cryptos', __name__, "")




# works good
@watchlist_crypto_routes.route('/')
@login_required
def get_watchlist_cryptos():
    """
    Get all watchlist_cryptos for the logged-in user.
    """
    watchlist = Watchlist.query.filter_by(user_id=current_user.id).first()
    if not watchlist:
        return jsonify({'watchlist_cryptos': []})

    watchlist_cryptos = Watchlist_Crypto.query.options(joinedload(Watchlist_Crypto.crypto))\
        .filter_by(watchlist_id=watchlist.id).all()
    return jsonify({'watchlist_cryptos': [watchlist_crypto.to_dict() for watchlist_crypto in watchlist_cryptos]})




@watchlist_crypto_routes.route('/', methods=['POST'])
@login_required
def create_watchlist_crypto():
    """
    Create a new watchlist_crypto for the logged-in user.
    """
    data = request.get_json()
    watchlist_id = data.get("watchlist_id")
    crypto_id = data.get("crypto_id")



    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if not watchlist:
        return jsonify({'error': 'Watchlist not found for user'}), 404

    new_watchlist_crypto = Watchlist_Crypto(watchlist_id=watchlist_id, crypto_id=crypto_id)
    db.session.add(new_watchlist_crypto)
    db.session.commit()

    return jsonify(new_watchlist_crypto.to_dict()), 201







@watchlist_crypto_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist_crypto(id):
    """
    Delete a user's watchlist_crypto.
    """
    watchlist_crypto = Watchlist_Crypto.query.get(id)

    if not watchlist_crypto or watchlist_crypto.watchlist.user_id != current_user.id:
        return jsonify({'error': 'Watchlist_Crypto not found'}), 404

    db.session.delete(watchlist_crypto)
    db.session.commit()
    return jsonify({'message': 'Watchlist_Crypto deleted successfully'})
