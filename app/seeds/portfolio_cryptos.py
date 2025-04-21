from app.models import db, Portfolio_Crypto, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolio_cryptos():
    c1 = Portfolio_Crypto(
        portfolio_id=1, crypto_id=1, quantity=10.77)
    c2 = Portfolio_Crypto(
        portfolio_id=1, crypto_id=2, quantity=3000.88)
    c3 = Portfolio_Crypto(
        portfolio_id=3, crypto_id=3, quantity=2160.89)
    c4 = Portfolio_Crypto(
        portfolio_id=4, crypto_id=4, quantity=392_000.15)
    c5 = Portfolio_Crypto(
        portfolio_id=5, crypto_id=5, quantity=1800.25)
    c6 = Portfolio_Crypto(
        portfolio_id=6, crypto_id=5, quantity=1800.25)
    c7 = Portfolio_Crypto(
        portfolio_id=7, crypto_id=5, quantity=1800.25)
    c8 = Portfolio_Crypto(
        portfolio_id=7, crypto_id=4, quantity=1800.25)
    c9 = Portfolio_Crypto(
        portfolio_id=7, crypto_id=3, quantity=180_000_000.25)
    c10 = Portfolio_Crypto(
        portfolio_id=7, crypto_id=2, quantity=1800.25)
    c11 = Portfolio_Crypto(
        portfolio_id=7, crypto_id=1, quantity=1800.25)


    db.session.add(c1)
    db.session.add(c2)
    db.session.add(c3)
    db.session.add(c4)
    db.session.add(c5)
    db.session.add(c6)
    db.session.add(c7)
    db.session.add(c8)
    db.session.add(c9)
    db.session.add(c10)
    db.session.add(c11)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolio_cryptos():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_cryptos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_cryptos"))

    db.session.commit()
