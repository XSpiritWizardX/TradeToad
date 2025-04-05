from flask.cli import AppGroup
from .users import seed_users, undo_users
from .watchlists import seed_watchlists, undo_watchlists
from .stocks import seed_stocks, undo_stocks
from .watchlist_stocks import seed_watchlist_stocks, undo_watchlist_stocks
from .stock_transactions import seed_stock_transactions, undo_stock_transactions

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_watchlists()
        undo_stocks()
        undo_watchlist_stocks()
        undo_stock_transactions()
    # Add other seed functions here
    seed_users()
    seed_watchlists()
    seed_stocks()
    seed_watchlist_stocks()
    seed_stock_transactions()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_watchlists()
    undo_stocks()
    undo_watchlist_stocks()
    undo_stock_transactions()

    # Add other undo functions here
