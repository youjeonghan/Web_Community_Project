from flask import Blueprint

api = Blueprint("api", __name__)

from api import post
from api import comment
from api import report
from api import user
from api import admin
from api import search