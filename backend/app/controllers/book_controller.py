from flask import Blueprint, jsonify, request, session
from app.services.book_service import create_book, get_mypersonalBook, \
    get_bookShop, changeBookStatus, notification_book, Book, \
    delete_book_and_notify


book_bp = Blueprint('book', __name__)


@book_bp.route("/new-book", methods=["POST"])
def new_book():
    """
    Endpoint to create a new book advertisement.

    Function used from services: create_book()

    Returns:
        *tuple*: A tuple containing a JSON response with a success message
          and the HTTP status code 201.
    """
    data = request.json
    user_email = session.get('user_email')
    create_book(data, user_email)
    return jsonify({
        "message": "Book advertisement created successfully"
        }), 201


@book_bp.route('/book-shop', methods=['GET'])
def get_bookShopannouncements():
    """
    Endpoint to retrieve book-shop announcements.

    Function used from services: get_bookShop()

    Returns:
        *list*: List of book-shop announcements.
    """
    user_email = session.get('user_email')
    books = get_bookShop(user_email)
    return jsonify(books)


@book_bp.route('/personal-book', methods=['GET'])
def get_personalBook():
    """
    Endpoint to retrieve the logged-in user's lists of books for sale.

    Function used from services: get_mypersonalBook()

    Returns:
        *list*: List of personal book-shop announcements.
    """
    user_email = session.get('user_email')
    state = "in vendita"
    books = get_mypersonalBook(user_email, state)
    return jsonify(books)


@book_bp.route('/sold-book', methods=['POST'])
def get_soldBook():
    """
    Endpoint to change the status of a book to sold.

    Function used from services: changeBookStatus()

    Returns:
        *tuple*: A tuple containing a JSON response with a success message and
          the HTTP status code 200.
    """
    data = request.json
    changeBookStatus(data)

    return jsonify({"message": "Libro venduto"}), 200


@book_bp.route('/notificate-book', methods=['POST'])
def get_notificateBook():
    """
    Endpoint to handle notification for a book.

    This endpoint receives a POST request containing JSON data with
    information about the book. It retrieves the logged-in user's email from
    the session and calls the notification_book function to create a
    notification for the book.

    Returns:
        *tuple*: A tuple containing a JSON response with a success message
         and the HTTP status code 200.
    """
    user_email = session.get('user_email')
    data = request.json
    notification_book(data, user_email)

    return jsonify({"message": "Autore notificato"}), 200


@book_bp.route('/personal-book-sold', methods=['GET'])
def get_personalBookSold():
    """
    Endpoint to retrieve listings of books sold from the logged-in user.

    Function used from services: get_mypersonalBook()

    Returns:
        *list*: List of personal book-sold announcements.
    """
    user_email = session.get('user_email')
    state = "venduto"
    books = get_mypersonalBook(user_email, state)
    return jsonify(books)


@book_bp.route('/delete-book/<int:book_id>', methods=['DELETE'])
def delete_ad(book_id):
    """
    Endpoint to delete an announcement posted by the logged-in user.

    Args:
        ad_id (int): ID of the announcement to be deleted.

    Returns:
        *json*: Success or error message.
    """
    user_email = session.get('user_email')
    book = Book.query.filter_by(id=book_id, student_email=user_email).first()
    if book:
        success = delete_book_and_notify(book_id)
        if success:
            return jsonify({
                'success': 'Announcement deleted successfully'
                }), 200
        else:
            return jsonify({
                'error': 'An error occurred while deleting the announcement'
                }), 500
    else:
        return jsonify({
            'error': 'Announcement not found or not authorized'
            }), 404
