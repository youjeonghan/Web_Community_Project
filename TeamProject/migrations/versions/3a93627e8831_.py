"""empty message

Revision ID: 3a93627e8831
Revises: b54734b173b4
Create Date: 2020-08-29 14:30:20.071911

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '3a93627e8831'
down_revision = 'b54734b173b4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('noticeboard')
    op.drop_constraint('comment_ibfk_1', 'comment', type_='foreignkey')
    op.create_foreign_key(None, 'comment', 'board', ['board_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'comment', type_='foreignkey')
    op.create_foreign_key('comment_ibfk_1', 'comment', 'noticeboard', ['board_id'], ['id'], ondelete='CASCADE')
    op.create_table('noticeboard',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('subject', mysql.VARCHAR(length=200), nullable=False),
    sa.Column('content', mysql.TEXT(), nullable=False),
    sa.Column('create_date', mysql.DATETIME(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###