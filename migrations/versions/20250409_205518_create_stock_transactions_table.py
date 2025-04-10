"""create_stock_transactions_table

Revision ID: 1f6612673d79
Revises: e45e0b8930cf
Create Date: 2025-04-09 20:55:18.877963

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f6612673d79'
down_revision = 'e45e0b8930cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stock_transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('shares', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.Column('price', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.Column('action', sa.String(length=4), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('stock_transactions')
    # ### end Alembic commands ###
