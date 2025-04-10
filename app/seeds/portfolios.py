from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolios():
    p1 = Portfolio(
        user_id=1, total_cash=1000000.05, available_cash=10.77)
    p2 = Portfolio(
        user_id=2, total_cash=1000000.11, available_cash=3000.88)
    p3 = Portfolio(
        user_id=3, total_cash=1000000.45, available_cash=2160.89)
    p4 = Portfolio(
        user_id=4, total_cash=1000000.55, available_cash=392000.15)
    p5 = Portfolio(
        user_id=5, total_cash=1000000.66, available_cash=1800.25)

    db.session.add(p1)
    db.session.add(p2)
    db.session.add(p3)
    db.session.add(p4)
    db.session.add(p5)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
