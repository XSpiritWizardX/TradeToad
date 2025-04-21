from app.models import db, Crypto_Transaction, environment, SCHEMA
from sqlalchemy.sql import text


def seed_crypto_transactions():
    trans1 = Crypto_Transaction(
        user_id=1, crypto_id=1, shares=100.05, price=504.73, action='BUY')
    trans2 = Crypto_Transaction(
        user_id=2, crypto_id=2, shares=10.13, price=188.38, action='BUY')
    trans3 = Crypto_Transaction(
        user_id=3, crypto_id=3, shares=50.00, price=171.00, action='BUY')
    trans4 = Crypto_Transaction(
        user_id=4, crypto_id=4, shares=1.00, price=855.86, action='BUY')
    trans5 = Crypto_Transaction(
        user_id=5, crypto_id=5, shares=200000000.00, price=147.74, action='BUY')


    db.session.add(trans1)
    db.session.add(trans2)
    db.session.add(trans3)
    db.session.add(trans4)
    db.session.add(trans5)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_crypto_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.crypto_transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM crypto_transactions"))

    db.session.commit()
