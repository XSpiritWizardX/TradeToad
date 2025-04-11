from app.models import db, Watchlist_Crypto, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_watchlist_cryptos():
    demoWatch = Watchlist_Crypto(watchlist_id=1, crypto_id=5)
    marnieWatch = Watchlist_Crypto(watchlist_id=2, crypto_id=5)
    elon1 = Watchlist_Crypto(watchlist_id=7, crypto_id=1)
    elon2 = Watchlist_Crypto(watchlist_id=7, crypto_id=2)
    elon3 = Watchlist_Crypto(watchlist_id=7, crypto_id=3)
    elon4 = Watchlist_Crypto(watchlist_id=7, crypto_id=4)
    elon5 = Watchlist_Crypto(watchlist_id=7, crypto_id=5)






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
def undo_watchlist_cryptos():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_cryptos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_cryptos"))

    db.session.commit()
