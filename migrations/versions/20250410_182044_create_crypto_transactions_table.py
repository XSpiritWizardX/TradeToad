"""create_crypto_transactions_table

Revision ID: 08a83bc9bddf
Revises: a05f05e2c5cb
Create Date: 2025-04-10 18:20:44.793890

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '08a83bc9bddf'
down_revision = 'a05f05e2c5cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('crypto_transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    sa.Column('crypto_id', sa.Integer(), nullable=False),
    sa.Column('shares', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.Column('price', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.Column('action', sa.String(length=4), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('crypto_transactions')
    # ### end Alembic commands ###
