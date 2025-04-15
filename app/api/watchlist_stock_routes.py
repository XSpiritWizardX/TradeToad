from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app.models import Watchlist_Stock, db




watchlist_stock_routes = Blueprint('watchlist_stocks', __name__, "")









@watchlist_stock_routes.route('/')
@login_required
def get_watchlist_stocks():
    """
    Get all watchlist_stocks for the logged-in user.
    """
    watchlist_stocks = Watchlist_Stock.query.all()
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



    new_watchlist_stock = Watchlist_Stock(user_id=current_user.id, watchlist_id=watchlist_id, stock_id=stock_id)
    db.session.add(new_watchlist_stock)
    db.session.commit()

    return jsonify(new_watchlist_stock.to_dict()), 201







@watchlist_stock_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist_stock(id):
    """
    Delete a user's watchlist_stock.
    """
    watchlist_stock = Watchlist_Stock.query.filter_by(id=id, user_id=current_user.id).first()

    if not watchlist_stock:
        return jsonify({'error': 'Watchlist_Stock not found'}), 404

    db.session.delete(watchlist_stock)
    db.session.commit()
    return jsonify({'message': 'Watchlist_Stock deleted successfully'})
