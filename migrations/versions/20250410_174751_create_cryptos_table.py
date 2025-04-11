"""create_cryptos_table

Revision ID: 72c9e591a96b
Revises: 1f6612673d79
Create Date: 2025-04-10 17:47:51.572492

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72c9e591a96b'
down_revision = '1f6612673d79'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cryptos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('symbol', sa.String(length=5), nullable=False),
    sa.Column('company', sa.String(length=40), nullable=False),
    sa.Column('market_cap', sa.Numeric(precision=20, scale=2), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cryptos')
    # ### end Alembic commands ###
