"""create_portfolio_stocks_table

Revision ID: e45e0b8930cf
Revises: bf23322206e4
Create Date: 2025-04-09 20:45:46.783537

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e45e0b8930cf'
down_revision = 'bf23322206e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('portfolio_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), sa.ForeignKey("portfolios.id"), nullable=False),
    sa.Column('stock_id', sa.Integer(), sa.ForeignKey("stocks.id"), nullable=False),
    sa.Column('quantity', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('portfolio_stocks')
    # ### end Alembic commands ###
