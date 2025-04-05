from app.models import db, Watchlist_Stock, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_watchlist_stocks():
    demoWatch = Watchlist_Stock(watchlist_id=1, stock_id=5)
    marnieWatch = Watchlist_Stock(watchlist_id=2, stock_id=5)
    elon1 = Watchlist_Stock(watchlist_id=7, stock_id=1)
    elon2 = Watchlist_Stock(watchlist_id=7, stock_id=2)
    elon3 = Watchlist_Stock(watchlist_id=7, stock_id=3)
    elon4 = Watchlist_Stock(watchlist_id=7, stock_id=4)
    elon5 = Watchlist_Stock(watchlist_id=7, stock_id=5)

    db.session.add(demoWatch)
    db.session.add(marnieWatch)
    db.session.add(elon1)
    db.session.add(elon2)
    db.session.add(elon3)
    db.session.add(elon4)
    db.session.add(elon5)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
