from flask import jsonify
from flask import request
from models import Post, Comment, Board, User
from api import api
from sqlalchemy import and_, or_
from controllers.search_con import search_returnlist

### 전체 게시판의 게시글 검색 ###
@api.route("/search", methods=["GET"])
def search_all():
    search_type = request.args.get("search_type")
    input_value = request.args.get("input_value")
    page = int(request.args.get("page"))

    search_num, returnlist = search_returnlist(search_type, input_value, page, id=0)
    if not returnlist:
        return jsonify(), 204

    return jsonify({"search_num": search_num, "returnlist": returnlist}), 201


### 해당 게시판의 게시글 검색 ###
@api.route("/search/<board_id>", methods=["GET"])
def search_inboard(board_id):
    search_type = request.args.get("search_type")
    input_value = request.args.get("input_value")
    page = int(request.args.get("page"))

    search_num, returnlist = search_returnlist(search_type, input_value, page, board_id)
    if not returnlist:
        return jsonify(), 204

    return jsonify({"search_num": search_num, "returnlist": returnlist}), 201