from flask import Blueprint, jsonify
from flask_wtf.csrf import generate_csrf

csrf_routes = Blueprint('csrf', __name__)

@csrf_routes.route('/restore')
def restore_csrf():
    """
    Returns a new CSRF token
    """
    return jsonify(csrf_token=generate_csrf())