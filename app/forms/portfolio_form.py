from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired

class PortfolioForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    # balance = FloatField('balance')
    total_cash = FloatField('total_cash')
