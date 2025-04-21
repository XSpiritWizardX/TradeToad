from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_watchlists():
    demoWatch = Watchlist(user_id=1, name="Tech Stocks")
    marnieWatch = Watchlist(user_id=2, name="Crypto Favorites")
    bobbieWatch = Watchlist(user_id=3, name="Blue Chips")
    trixieWatch = Watchlist(user_id=4, name="Growth Stocks")
    janeWatch = Watchlist(user_id=5, name="Dividend Stocks")
    lukeWatch = Watchlist(user_id=6, name="Penny Stocks")
    elonWatch = Watchlist(user_id=7, name="ETFs")


    db.session.add(demoWatch)
    db.session.add(marnieWatch)
    db.session.add(bobbieWatch)
    db.session.add(trixieWatch)
    db.session.add(janeWatch)
    db.session.add(lukeWatch)
    db.session.add(elonWatch)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
