from flask import Blueprint, request, session, jsonify
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import IntegrityError

auth_routes = Blueprint('auth', __name__, url_prefix='/auth')


@auth_routes.route('/')
def authenticate():
    """Authenticates a user."""
    try:
        if current_user.is_authenticated:
            return current_user.to_dict()
        return {'errors': {'authentication': 'Unauthorized'}}, 401
    except Exception as e:
        return {'errors': {'server': str(e)}}, 500


@auth_routes.route('/login', methods=['POST'])
def login():
    """Logs a user in."""
    form = LoginForm()

    try:
        form['csrf_token'].data = request.cookies.get('csrf_token')
        if not form['csrf_token'].data:
            return {'errors': {'csrf_token': 'Missing CSRF token'}}, 400

        if form.validate_on_submit():
            user = User.query.filter(User.email == form.data['email']).first()
            if user:
                login_user(user, remember=True)
                return user.to_dict()
            return {'errors': {'email': 'Invalid credentials'}}, 401
        return form.errors, 401

    except Exception as e:
        return {'errors': {'server': str(e)}}, 500


@auth_routes.route('/logout', methods=['GET'])
@login_required
def logout():
    """Logs a user out."""
    try:
        logout_user()
        return {'message': 'User logged out'}
    except Exception as e:
        return {'errors': {'server': str(e)}}, 500


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """Creates a new user and logs them in."""
    form = SignUpForm()

    try:
        form['csrf_token'].data = request.cookies.get('csrf_token')
        if not form['csrf_token'].data:
            return {'errors': {'csrf_token': 'Missing CSRF token'}}, 400

        if form.validate_on_submit():
            user = User(
                firstName=form.data['firstName'],
                lastName=form.data['lastName'],
                username=form.data['username'],
                email=form.data['email'],
                password=form.data['password'],
            )
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            return user.to_dict()

        return form.errors, 401

    except IntegrityError as ie:
        db.session.rollback()
        return {'errors': {'database': 'Email or username already exists.'}}, 400

    except Exception as e:
        return {'errors': {'server': str(e)}}, 500


@auth_routes.route('/unauthorized')
def unauthorized():
    """Returns unauthorized JSON when flask-login authentication fails."""
    return {'errors': {'message': 'Unauthorized'}}, 401
