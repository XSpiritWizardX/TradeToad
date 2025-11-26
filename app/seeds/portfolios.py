from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolios():
    p1 = Portfolio(
        user_id=1, name='port1', total_cash=25000.00, available_cash=25000.00)
    p2 = Portfolio(
        user_id=2, name='port2', total_cash=18000.00, available_cash=12000.00)
    p3 = Portfolio(
        user_id=3, name='port3', total_cash=15000.00, available_cash=9000.00)
    p4 = Portfolio(
        user_id=4, name='port4', total_cash=12000.00, available_cash=12000.00)
    p5 = Portfolio(
        user_id=5, name='port5', total_cash=8000.00, available_cash=5000.00)
    p6 = Portfolio(
        user_id=6, name='port6', total_cash=6000.00, available_cash=6000.00)
    p7 = Portfolio(
        user_id=7, name='port7', total_cash=10000.00, available_cash=7000.00)


    db.session.add(p1)
    db.session.add(p2)
    db.session.add(p3)
    db.session.add(p4)
    db.session.add(p5)
    db.session.add(p6)
    db.session.add(p7)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
