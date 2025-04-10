"""create_portfolios_table

Revision ID: bf23322206e4
Revises: 6a0c5edb9663
Create Date: 2025-04-09 20:15:29.131278

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bf23322206e4'
down_revision = '6a0c5edb9663'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('portfolios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    sa.Column('total_cash', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.Column('available_cash', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('portfolios')
    # ### end Alembic commands ###
