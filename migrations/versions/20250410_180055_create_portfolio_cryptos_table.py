"""create_portfolio_cryptos_table

Revision ID: 4901d01e474d
Revises: 72c9e591a96b
Create Date: 2025-04-10 18:00:55.939048

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4901d01e474d'
down_revision = '72c9e591a96b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('portfolio_cryptos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('portfolio_id', sa.Integer(), sa.ForeignKey("portfolios.id"), nullable=False),
    sa.Column('crypto_id', sa.Integer(), sa.ForeignKey("cryptos.id"), nullable=False),
    sa.Column('quantity', sa.Numeric(precision=15, scale=2), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('portfolio_cryptos')
    # ### end Alembic commands ###
