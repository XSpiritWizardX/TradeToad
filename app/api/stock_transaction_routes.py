from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from polygon import RESTClient
from app.models import db, Stock_Transaction, Stock
import polygon.polygon_config as polygon_config

transaction_routes = Blueprint('transactions', __name__)
client = RESTClient(polygon_config.API_KEY)

@transaction_routes.route('/search')
@login_required
def search_stock():
    """
    Search and fetch aggregated stock data for a given ticker.
    """
    ticker = request.args.get('ticker')
    start_date = request.args.get('start')
    end_date = request.args.get('end')

    if not ticker or not start_date or not end_date:
        return jsonify({'error': 'ticker, start and end are required params'}), 400

    try:
        results = []
        for agg in client.list_aggs(ticker, 1, "day", start_date, end_date, adjusted=True, sort="asc", limit=30):
            results.append({
                'timestamp': agg.timestamp,
                'open': agg.open,
                'close': agg.close,
                'high': agg.high,
                'low': agg.low,
                'volume': agg.volume
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@transaction_routes.route('/', methods=['POST'])
@login_required
def create_transaction():
    """
    Create a new stock transaction (BUY or SELL).
    """
    data = request.get_json()
    stock_id = data.get('stock_id')
    shares = data.get('shares')
    price = data.get('price')
    action = data.get('action')  # 'BUY' or 'SELL'

    if not all([stock_id, shares, price, action]):
        return jsonify({'error': 'Missing transaction data'}), 400

    transaction = Stock_Transaction(
        user_id=current_user.id,
        stock_id=stock_id,
        shares=shares,
        price=price,
        action=action.upper()
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify(transaction.to_dict()), 201
