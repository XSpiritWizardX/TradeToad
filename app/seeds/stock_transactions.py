from app.models import db, Stock_Transaction, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stock_transactions():
    trans1 = Stock_Transaction(
        user_id=1, stock_id=1, shares=100.05, price=504.73, action='BUY')
    trans2 = Stock_Transaction(
        user_id=2, stock_id=2, shares=10.13, price=188.38, action='BUY')
    trans3 = Stock_Transaction(
        user_id=3, stock_id=3, shares=50.00, price=171.00, action='BUY')
    trans4 = Stock_Transaction(
        user_id=4, stock_id=4, shares=1.00, price=855.86, action='BUY')
    trans5 = Stock_Transaction(
        user_id=5, stock_id=5, shares=200000000.00, price=147.74, action='BUY')


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
def undo_stock_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stock_transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stock_transactions"))

    db.session.commit()
