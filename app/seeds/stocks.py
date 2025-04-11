from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stocks():
    meta = Stock(
        symbol='META', company='Meta Platforms Inc', market_cap=1300000000000)
    apple = Stock(
        symbol='AAPL', company='Apple Inc', market_cap=3030000000000)
    amazon = Stock(
        symbol='AMZN', company='Amazon Inc', market_cap=2160000000000)
    netflix = Stock(
        symbol='NFLX', company='Netflix Inc', market_cap=392000000000)
    google = Stock(
        symbol='GOOGL', company='Alphabet Inc', market_cap=1840000000000)






    db.session.add(meta)
    db.session.add(apple)
    db.session.add(amazon)
    db.session.add(netflix)
    db.session.add(google)






    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
