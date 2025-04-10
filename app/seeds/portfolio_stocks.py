from app.models import db, Portfolio_Stock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolio_stocks():
    p1 = Portfolio_Stock(
        portfolio_id=1, stock_id=1, quantity=10.77)
    p2 = Portfolio_Stock(
        portfolio_id=1, stock_id=2, quantity=3000.88)
    p3 = Portfolio_Stock(
        portfolio_id=3, stock_id=3, quantity=2160.89)
    p4 = Portfolio_Stock(
        portfolio_id=4, stock_id=4, quantity=392000.15)
    p5 = Portfolio_Stock(
        portfolio_id=5, stock_id=5, quantity=1800.25)
    p6 = Portfolio_Stock(
        portfolio_id=6, stock_id=5, quantity=1800.25)
    p7 = Portfolio_Stock(
        portfolio_id=7, stock_id=5, quantity=1800.25)
    p8 = Portfolio_Stock(
        portfolio_id=7, stock_id=4, quantity=1800.25)
    p9 = Portfolio_Stock(
        portfolio_id=7, stock_id=3, quantity=1800.25)
    p10 = Portfolio_Stock(
        portfolio_id=7, stock_id=2, quantity=1800.25)
    p11 = Portfolio_Stock(
        portfolio_id=7, stock_id=1, quantity=1800.25)







    db.session.add(p1)
    db.session.add(p2)
    db.session.add(p3)
    db.session.add(p4)
    db.session.add(p5)
    db.session.add(p6)
    db.session.add(p7)
    db.session.add(p8)
    db.session.add(p9)
    db.session.add(p10)
    db.session.add(p11)





    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolio_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_stocks"))

    db.session.commit()
