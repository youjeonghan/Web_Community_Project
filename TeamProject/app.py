from datetime import datetime, timedelta
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from models import db
from api import api
from view import view
import config


app = Flask(__name__)
app.config.from_object(config)
jwt = JWTManager(app)
migrate = Migrate()
db.init_app(app)
migrate.init_app(app, db)
db.app = app
db.create_all()

app.register_blueprint(view)
app.register_blueprint(api, url_prefix="/api")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)