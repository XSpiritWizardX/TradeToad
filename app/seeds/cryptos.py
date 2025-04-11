from app.models import db, Crypto, environment, SCHEMA
from sqlalchemy.sql import text


def seed_cryptos():
    btc = Crypto(
        symbol='BTC', company='Bitcoin', market_cap=1_584_000_000_000)
    eth = Crypto(
        symbol='ETH', company='Ethereum', market_cap=184_000_000_000)
    doge = Crypto(
        symbol='DOGE', company='Dogecoin', market_cap=22_000_000_000)
    solana = Crypto(
        symbol='SOL', company='Solana', market_cap=57_000_000_000)
    xrp = Crypto(
        symbol='XRP', company='XRP', market_cap=115_000_000_000)






    db.session.add(btc)
    db.session.add(eth)
    db.session.add(doge)
    db.session.add(solana)
    db.session.add(xrp)






    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_cryptos():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cryptos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cryptos"))

    db.session.commit()
