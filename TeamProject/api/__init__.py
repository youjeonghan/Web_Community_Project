from flask import Blueprint

api = Blueprint('api',__name__)

from api import post
from api import user