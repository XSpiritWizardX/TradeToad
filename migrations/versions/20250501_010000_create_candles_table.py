"""create candles table

Revision ID: 7f1eaa1c9b3b
Revises: 9c1b2f7c4a10
Create Date: 2025-05-01 01:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f1eaa1c9b3b'
down_revision = '9c1b2f7c4a10'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'candles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('symbol', sa.String(length=15), nullable=False),
        sa.Column('timestamp', sa.BigInteger(), nullable=False),
        sa.Column('open', sa.Float(), nullable=False),
        sa.Column('high', sa.Float(), nullable=False),
        sa.Column('low', sa.Float(), nullable=False),
        sa.Column('close', sa.Float(), nullable=False),
        sa.Column('volume', sa.Float(), nullable=True),
        sa.Column('timespan', sa.String(length=10), nullable=True),
        sa.Column('source', sa.String(length=30), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_candles_symbol', 'candles', ['symbol'])
    op.create_index('ix_candles_timestamp', 'candles', ['timestamp'])


def downgrade():
    op.drop_index('ix_candles_timestamp', table_name='candles')
    op.drop_index('ix_candles_symbol', table_name='candles')
    op.drop_table('candles')
