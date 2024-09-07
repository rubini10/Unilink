from flask import Blueprint, jsonify, request, session
from app.services.user_service import create_user, authenticate_user, \
    extract_user, delete_user
from app.models.book import db, Book  # noqa
from app.models.user import User
from app.models.ad import *  # noqa
from app.services.ad_service import *  # noqa
from app.controllers.user_controller import *  # noqa


user_bp = Blueprint('user', __name__)


@user_bp.route("/signup", methods=["POST"])
def signup():
    """
    Endpoint to sign up a new user.

    Function used from services: authenticate_user() and create_user()

    Returns:
        *tuple*:
            - A tuple containing a JSON response with:
                - An error message if the email already exists, with HTTP
                  status code 409 (Conflict).
                - A success message if the user is created successfully,
                  along with the corresponding HTTP status code 201 (Created).
    """
    data = request.json
    email = data.get("email")
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"error": "Email already exists"}), 409

    create_user(data)
    return jsonify({"message": "User created successfully"}), 201


@user_bp.route("/login", methods=["POST"])
def login():
    """
    Endpoint to log in a user.

    Function used from services: authenticate_user()

    Returns:
        *tuple*:
            - A tuple containing a JSON response with:
                - A success message if the user is logged in successfully
                  along with the corresponding HTTP status code (200).
                - An error message if the login credentials are incorrect,
                  with HTTP status code 401 (Unauthorized Access).
    """
    data = request.json

    if authenticate_user(data['email'], data['password']):
        session['user_email'] = data['email']
        return jsonify({"message": "User logged in successfully"}), 200
    return jsonify({"error": "Unauthorized Access"}), 401


@user_bp.route("/logout", methods=["POST"])
def logout():
    """
    Endpoint to log out a user.

    Returns:
        *tuple*: A tuple containing a JSON response with a success message
          indicating that the user has been logged out successfully, along
          with the corresponding HTTP status code 200.
    """
    session.pop('user_email', None)
    return jsonify({"message": "User logged out successfully"}), 200


@user_bp.route("/profile", methods=["GET"])
def profile():
    """
    Endpoint to retrieve and display the profile of a currently logged-in
      user.

    This function first attempts to identify the user through a session key
     that should contain the user's email. It checks if the user is logged
     in by verifying the presence of this email in the session.
     If the email is not found, indicating no active session or login, it
     returns an error message stating the user is not logged in, along with
     an HTTP status code 401 (Unauthorized Access).

    If a user email is present in the session, the function then attempts to
     retrieve the complete user profile using a helper function
     `extract_user`.
    If the helper function returns a 404 error, it signifies that the user
      could not be found in the database, and the function returns a
      corresponding error message and HTTP status code 404 (Not Found).

    Returns:
        tuple: A tuple containing a JSON response and an HTTP status code:
            - ({"error": "User not logged in"}, 401) if no user email is found
              in the session.
            - ({"error": "User not found"}, 404) if no user profile could
              be retrieved.
            - (profile, 200) containing the user's profile data if
              successfully retrieved.
    """
    user_email = session.get("user_email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    profile = extract_user(user_email)

    if profile == 404:
        return jsonify({"error": "User not found"}), 404

    return jsonify(profile), 200


@user_bp.route("/me", methods=["GET"])
def loggedinUser():
    """
    Retrieve the email of the currently logged-in user.

    This endpoint returns the email of the user currently logged in.
    It extracts the email from the session and returns it in a JSON response.

    Returns:
    - JSON response containing the email of the logged-in user and HTTP
      status code 200.
    """
    user_email = session.get("user_email")

    return jsonify({"email": user_email}), 200


@user_bp.route("/delete-profile", methods=['DELETE'])
def delete_profile():
    """
    Route to delete the user's profile and associated data.

    Function used from services: authenticate_user()

    Deletes the profile and associated data of the authenticated user.
    Requires the user to be authenticated and makes a DELETE request.
    Returns a success message if the deletion is successful,
    otherwise returns an error message if the user is not found.

    Returns:
        A JSON response indicating success or error message.

    """
    user_email = session.get("user_email")
    response = delete_user(user_email)

    if response == 200:
        return jsonify({
            'success': 'Profile and associated data deleted successfully'
            }), 200
    else:
        return jsonify({'error': 'User not found'}), 404
