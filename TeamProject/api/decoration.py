from functools import wraps
from flask import current_app
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        if user_id != current_app.config["ADMIN_ID"]:
            return {"msg": "Bad Access Token"}, 201
        return func(*args, **kwargs)

    return wrapper