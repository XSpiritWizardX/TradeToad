from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        firstName='DEMO', lastName='USER', username="Demo", email='demo@aa.io', password='password')
    marnie = User(
        firstName='MAR', lastName='MARNI', username="Demo2", email='marnie@aa.io', password='password')
    bobbie = User(
        firstName='BOB', lastName='BOBBIE', username="Demo3", email='bobbie@aa.io', password='password')
    trixie = User(
        firstName='Trixie', lastName='Stardust', username="Demo4", email='2for1dances@aa.io', password='password')
    jane = User(
        firstName='Jane', lastName='Way', username="Demo5", email='enterprisecap@aa.io', password='password')
    luke = User(
        firstName='Luke', lastName='Skywalker', username="Demo6", email='thechosenone@aa.io', password='password')
    elon = User(
        firstName='Elon', lastName='Tusks', username="Demo7", email='etusks@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    # new users
    db.session.add(trixie)
    db.session.add(jane)
    db.session.add(luke)
    db.session.add(elon)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
