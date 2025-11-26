from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload

from app.models import Watchlist, Watchlist_Stock, db




watchlist_stock_routes = Blueprint('watchlist_stocks', __name__, "")









@watchlist_stock_routes.route('/')
@login_required
def get_watchlist_stocks():
    """
    Get all watchlist_stocks for the logged-in user.
    """
    watchlist = Watchlist.query.filter_by(user_id=current_user.id).first()
    if not watchlist:
        return jsonify({'watchlist_stocks': []})

    watchlist_stocks = Watchlist_Stock.query.options(joinedload(Watchlist_Stock.stock))\
        .filter_by(watchlist_id=watchlist.id).all()
    return jsonify({'watchlist_stocks': [watchlist_stock.to_dict() for watchlist_stock in watchlist_stocks]})




@watchlist_stock_routes.route('/', methods=['POST'])
@login_required
def create_watchlist_stock():
    """
    Create a new watchlist_stock for the logged-in user.
    """
    data = request.get_json()
    watchlist_id = data.get("watchlist_id")
    stock_id = data.get("stock_id")



    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if not watchlist:
        return jsonify({'error': 'Watchlist not found for user'}), 404

    new_watchlist_stock = Watchlist_Stock(watchlist_id=watchlist_id, stock_id=stock_id)
    db.session.add(new_watchlist_stock)
    db.session.commit()

    return jsonify(new_watchlist_stock.to_dict()), 201







@watchlist_stock_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist_stock(id):
    """
    Delete a user's watchlist_stock.
    """
    watchlist_stock = Watchlist_Stock.query.get(id)

    if not watchlist_stock or watchlist_stock.watchlist.user_id != current_user.id:
        return jsonify({'error': 'Watchlist_Stock not found'}), 404

    db.session.delete(watchlist_stock)
    db.session.commit()
    return jsonify({'message': 'Watchlist_Stock deleted successfully'})
