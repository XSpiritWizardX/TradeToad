from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Watchlist, db

watchlist_routes = Blueprint('watchlists', __name__)


@watchlist_routes.route('/')
@login_required
def get_watchlists():
    """
    Get all watchlists for the logged-in user.
    """
    watchlists = Watchlist.query.filter_by(user_id=current_user.id).all()
    return jsonify({'watchlists': [watchlist.to_dict() for watchlist in watchlists]})


@watchlist_routes.route('/<int:id>')
@login_required
def get_watchlist(id):
    """
    Get a watchlist by ID for the logged-in user.
    """
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not watchlist:
        return jsonify({'error': 'Watchlist not found'}), 404
        
    return jsonify(watchlist.to_dict())


@watchlist_routes.route('/', methods=['POST'])
@login_required
def create_watchlist():
    """
    Create a new watchlist for the logged-in user.
    """
    data = request.get_json()
    name = data.get("name", "My Watchlist")  # get name from request or use default

    new_watchlist = Watchlist(user_id=current_user.id, name=name)
    db.session.add(new_watchlist)
    db.session.commit()

    return jsonify(new_watchlist.to_dict()), 201


@watchlist_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_watchlist(id):
    """
    Update a watchlist's name.
    """
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()

    if not watchlist:
        return jsonify({'error': 'Watchlist not found'}), 404

    data = request.get_json()
    new_name = data.get('name')

    if new_name is not None:
        watchlist.name = new_name

    db.session.commit()
    return jsonify(watchlist.to_dict())


@watchlist_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist(id):
    """
    Delete a user's watchlist.
    """
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()

    if not watchlist:
        return jsonify({'error': 'Watchlist not found'}), 404

    db.session.delete(watchlist)
    db.session.commit()
    return jsonify({'message': 'Watchlist deleted successfully'})
