"""create_prediction_signals_table

Revision ID: 9c1b2f7c4a10
Revises: 08a83bc9bddf
Create Date: 2025-04-30 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c1b2f7c4a10'
down_revision = '08a83bc9bddf'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'prediction_signals',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('symbol', sa.String(length=15), nullable=False),
        sa.Column('predicted_for', sa.DateTime(), nullable=True),
        sa.Column('timespan', sa.String(length=20), nullable=True),
        sa.Column('multiplier', sa.Integer(), nullable=True),
        sa.Column('span_days', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=10), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('predicted_price', sa.Float(), nullable=True),
        sa.Column('last_price', sa.Float(), nullable=True),
        sa.Column('mae', sa.Float(), nullable=True),
        sa.Column('model_used', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_prediction_signals_symbol'), 'prediction_signals', ['symbol'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_prediction_signals_symbol'), table_name='prediction_signals')
    op.drop_table('prediction_signals')
