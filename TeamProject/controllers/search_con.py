from models import Post, User
from sqlalchemy import or_


def search_returnlist(search_type, input_value, page, id):
    """검색한 결과를 리턴
    Args:
        search_type: 검색하고싶은 type (전체 / 제목 /  내용 / 글쓴이)
        input_value (int): 검색란 입력값
        page (int): 몇페이지를 타겟으로 출력하는지
        id (int): 0 -> 전체검색, 그외 -> 검색하고싶은 해당 게시판 id

    Returns:
        result_paging(postlist, page, paging_number=20): 결과물을 페이징후 리턴
    """
    input_value_all = f"%{input_value}%"

    postlist = type_postlist(id, search_type, input_value_all)

    input_value_list = input_value.split(" ")
    postlist_split = type_postlist_split(id, search_type, input_value_list)

    for post in postlist_split:
        if post not in postlist:
            postlist.append(post)

    return result_paging(postlist, page, paging_number=20)


def type_postlist(id, search_type, input_value_all):
    postlist = []
    if search_type == "전체":
        postlist = Post.query.join(User)
        if id != 0:
            postlist = postlist.filter(Post.board_id == id)
        postlist = (
            postlist.filter(
                or_(
                    Post.subject.ilike(input_value_all),
                    Post.content.ilike(input_value_all),
                    User.nickname.ilike(input_value_all),
                )
            )
            .order_by(Post.create_date.desc())
            .all()
        )
    elif search_type == "제목":
        postlist = Post.query
        if id != 0:
            postlist = Post.query.filter(Post.board_id == id)
        postlist = (
            postlist.filter(Post.subject.ilike(input_value_all))
            .order_by(Post.create_date.desc())
            .all()
        )
    elif search_type == "내용":
        postlist = Post.query
        if id != 0:
            postlist = Post.query.filter(Post.board_id == id)
        postlist = (
            postlist.filter(Post.content.ilike(input_value_all))
            .order_by(Post.create_date.desc())
            .all()
        )
    elif search_type == "글쓴이":
        postlist = Post.query.join(User)
        if id != 0:
            postlist = postlist.filter(Post.board_id == id)
        postlist = (
            postlist.filter(User.nickname.ilike(input_value_all))
            .order_by(Post.create_date.desc())
            .all()
        )

    return postlist


def type_postlist_split(id, search_type, input_value_list):
    for value in input_value_list:
        if search_type == "전체":
            postlist_split = Post.query.join(User)
            if id != 0:
                postlist_split = postlist_split.filter(Post.board_id == id)
            postlist_split = (
                postlist_split.filter(
                    or_(
                        Post.subject.ilike(f"%{value}%"),
                        Post.content.ilike(f"%{value}%"),
                        User.username.ilike(f"%{value}%"),
                    )
                )
                .order_by(Post.create_date.desc())
                .all()
            )
        elif search_type == "제목":
            postlist_split = Post.query
            if id != 0:
                postlist_split = postlist_split.filter(Post.board_id == id)
            postlist_split = (
                postlist_split.filter(Post.subject.ilike(f"%{value}%"))
                .order_by(Post.create_date.desc())
                .all()
            )
        elif search_type == "내용":
            postlist_split = Post.query
            if id != 0:
                postlist_split = postlist_split.filter(Post.board_id == id)
            postlist_split = (
                postlist_split.filter(Post.content.ilike(f"%{value}%"))
                .order_by(Post.create_date.desc())
                .all()
            )
        elif search_type == "글쓴이":
            postlist_split = Post.query.join(User)
            if id != 0:
                postlist_split = postlist_split.filter(Post.board_id == id)
            postlist_split = (
                postlist_split.filter(User.nickname.ilike(f"%{value}%"))
                .order_by(Post.create_date.desc())
                .all()
            )

    return postlist_split


def result_paging(postlist, page, paging_number):
    """전체 결과에서 원하는 페이지를 페이징 해주는 함수
    Args:
        postlist: 검색결과의 전체 리스트
        paging_number (int): 한페이지에 표시할 개수
        page (int): 몇페이지를 타겟으로 출력하는지

    Returns:
        list_num (int): 검색결과의 전체 개수
        returnlist: 페이징한 해당 페이지의 게시글 리스트
    """
    list_num = len(postlist)
    if list_num > paging_number * page:
        postlist = postlist[paging_number * (page - 1) : paging_number * page]
    elif list_num > paging_number * (page - 1):
        postlist = postlist[paging_number * (page - 1) : list_num]
    elif list_num <= paging_number * (page - 1):
        postlist = []

    returnlist = []
    for i, post in enumerate(postlist):
        returnlist.append(post.serialize)
        returnlist[i].update(board_name=post.board.board_name)

    return list_num, returnlist