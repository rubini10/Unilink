from flask import Blueprint, jsonify, request, session
from app.services.ad_service import get_ad, create_ad, enrollStudent, \
    get_personalMeeting, unsubscribeStudent, create_waitingUser, \
    WaitingList, db, get_notifications, Notification, \
    GenericNotification, unsubscribeStudentWaitinglist, Ad, \
    delete_ad_and_notify, get_my_ads, get_my_waitingList


ad_bp = Blueprint('ad', __name__)


@ad_bp.route('/tutoring', methods=['GET'])
def get_tutoring_announcements():
    """
    Endpoint to retrieve tutoring announcements.

    Function used from services: get_ad()

    Returns:
        *list*: List of tutoring announcements.
    """
    announcements = get_ad(["Tutoraggio", "Ripetizioni"])
    return jsonify(announcements)


@ad_bp.route('/study-group', methods=['GET'])
def get_study_group_announcements():
    """
    Endpoint to retrieve study group announcements.

    Function used from services: get_ad()

    Returns:
        *list*: List of study group announcements.
    """
    announcements = get_ad(["Gruppo studio"])
    return jsonify(announcements)


@ad_bp.route("/new-ad", methods=["POST"])
def new_ad():
    """
    Endpoint to create a new advertisement -tutoring and study group-

    Function used from services: create_ad()

    Returns:
        *tuple*: A tuple containing a JSON response with a success message
          and the HTTP status code 201.
    """
    data = request.json
    user_email = session.get('user_email')
    create_ad(data, user_email)
    return jsonify({"message": "Ad created successfully"}), 201


@ad_bp.route("/enroll", methods=["POST"])
def enroll():
    """
    Endpoint to handle POST requests for enrolling a user in an advertisement.

    This function retrieves the user's email from the session and extracts
    the advertisement ID from the JSON payload of the request. It then
    attempts to enroll the user in the specified advertisement by calling the
    `enrollStudent` function.

    Returns:
        tuple: A JSON response and an HTTP status code.
            - If the user is already enrolled, returns a 409 status with an
             error message.
            - If the user is the creator of the advertisement, returns a 403
             status with an error message.
            - If the enrollment is successful, returns a 201 status with a
             success message.
    """
    user_email = session.get('user_email')
    data = request.json
    response = enrollStudent(data, user_email)

    if response == 409:
        return jsonify({"error": "Sei già iscritto a questo annuncio"}), 409
    if response == 403:
        return jsonify({
            "error": "Il creatore dell'annuncio non può "
                     "iscriversi come partecipante"
                     }), 403
    if response == 201:
        return jsonify({"message": "Iscrizione avvenuta con successo"}), 201


@ad_bp.route('/personalMeeting', methods=['GET'])
def personal_meeting():
    """
    Endpoint to retrieve ads to which the logged-in user is subscribed

    Function used from services: get_personalMeeting()

    Returns:
        *list*: List of announcements to which the user is subscribed.
    """
    user_email = session.get('user_email')
    announcements = get_personalMeeting(user_email)
    return jsonify(announcements)


@ad_bp.route("/unsubscribe", methods=["POST"])
def unsubscribe():
    """
    Unsubscribe the currently logged-in user from a specific ad.

    This endpoint retrieves the user's email from the session and
    the advertisement ID from the request JSON payload, then calls
    the `unsubscribeStudent` function to handle the unsubscription process.

    Returns:
        *tuple*: A tuple containing a JSON response with a success message
        and the HTTP status code 201.

    """
    user_email = session.get('user_email')
    data = request.json
    id_ad = data.get("ad_id")
    unsubscribeStudent(id_ad, user_email)

    return jsonify({"message": "Disiscrizione avvenuta con successo"}), 201


@ad_bp.route("/waiting-list", methods=["POST"])
def waitingList():
    """
    Add the currently logged-in user to the waiting list of a specific ad.

    This endpoint allows the user to join the waiting list for a tutoring
    or study-group announcement if they are unable to enroll directly due
    to the ad being full.

    Function used from services: create_waitingUser()

    Returns:
    - JSON response containing a success message and HTTP status code 201
      if successful.
    - JSON response containing an error message and corresponding HTTP
      status code if not.

    Error Messages:
    - 409: "Sei già iscritto a questo annuncio. Non puoi iscriverti alla
      lista d'attesa se sei già un partecipante."
    - 403: "Il creatore dell'annuncio non può iscriversi come partecipante.
      Non è possibile aggiungersi alla propria lista d'attesa."
    - 404: "Sei già iscritto alla waiting list di questo annuncio.
      Non puoi iscriverti più di una volta."
    """
    user_email = session.get('user_email')
    data = request.json
    ad_id = data.get("ad_id")
    waiting = create_waitingUser(user_email, ad_id)

    if waiting == 409:
        return jsonify({"error": "Sei già iscritto a questo annuncio"}), 409
    if waiting == 403:
        return jsonify({
            "error": "Il creatore dell'annuncio non può"
                     "iscriversi come partecipante"}), 403
    if waiting == 404:
        return jsonify({"error": "Sei gia iscritto alla lista d'attesa"
                        "di questo annuncio"}), 404
    else:
        waiting_list_count = WaitingList.query.filter_by(ad_id=ad_id).count()
        position = waiting_list_count + 1
        new_waitingUser = WaitingList(ad_id=ad_id,
                                      student_email=user_email,
                                      position=position)
        db.session.add(new_waitingUser)
        db.session.commit()
        return jsonify({"message": "Iscrizione alla lista d'attesa"
                        "avvenuta con successo"}), 201


@ad_bp.route("/notifications", methods=["GET"])
def notifications():
    """
    Endpoint to retrieve notifications for the logged-in user.

    Function used from services: get_notifications()

    Returns:
        - JSON response containing a list of notifications
          and HTTP status code 200.
    """
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({"error": "Non autenticato"}), 401

    notifications_list = get_notifications(user_email)

    return jsonify(notifications_list), 200


@ad_bp.route("/notifications/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    """
    Endpoint to delete a specific notification (either standard or generic).

    Returns:
        - JSON response with a success message if the notification is deleted
          successfully and HTTP status code 200.
        - JSON response with a message indicating notification not found and
          HTTP status code 404.
    """
    notification = Notification.query.get(notification_id)
    if not notification:
        # If standard notification not found,try to find generic notification
        notification = GenericNotification.query.get(notification_id)
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404

    db.session.delete(notification)
    db.session.commit()
    return jsonify({'message': 'Notification deleted successfully'}), 200


@ad_bp.route('/notifications/mark-read/<int:notification_id>',
             methods=['POST'])
def mark_notification_as_read(notification_id):
    """
    Endpoint to mark a specific notification (either standard or generic)
      as read.

    Returns:
        - JSON response with a success message if the notification is marked
          as read successfully and HTTP status code 200.
        - JSON response with a message indicating notification not found and
          HTTP status code 404.
    """
    notification = Notification.query.get(notification_id)
    if not notification:
        # If standard notification not found, try to find gen notification
        notification = GenericNotification.query.get(notification_id)
        if not notification:
            return jsonify({"error": "Notification not found"}), 404

    notification.is_read = True
    db.session.commit()
    return jsonify({"success": "Notification marked as read"}), 200


@ad_bp.route("/notifications/unread-count", methods=["GET"])
def unread_notifications_count():
    """
    Endpoint to get the count of unread notifications (both standard
      and generic) for the logged-in user.

    Returns:
        - JSON response containing the count of unread notifications
          and HTTP status code 200.
    """
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({"error": "Not authenticated"}), 401

    standard_count = Notification.query.filter_by(
        student_email=user_email, is_read=False).count()
    generic_count = GenericNotification.query.filter_by(
        student_email=user_email, is_read=False).count()
    total_count = standard_count + generic_count
    return jsonify({"unread_count": total_count}), 200


@ad_bp.route("/notifications/mark-as-read", methods=["POST"])
def mark_notifications_as_read():
    """
    Endpoint to mark all unread notifications (both standard and generic)
      as read for the logged-in user.

    Returns:
        - JSON response with a success message if the notifications are marked
          as read successfully and HTTP status code 200.
        - JSON response with an error message if the user is not authenticated
          and HTTP status code 401.
    """
    user_email = session.get('user_email')
    if not user_email:
        return jsonify({"error": "Not authenticated"}), 401

    Notification.query.filter_by(student_email=user_email,
                                 is_read=False).update({"is_read": True})
    GenericNotification.query.filter_by(student_email=user_email,
                                        is_read=False).update(
                                             {"is_read": True})
    db.session.commit()
    return jsonify({"message": "Notifications updated as read"}), 200


@ad_bp.route('/personal-ads', methods=['GET'])
def get_personal_announcements():
    """
    Endpoint to retrieve personal announcements -tutoring, study group-

    Function used from services: get_my_ads()

    Returns:
        *list*: List of tutoring and study group announcements.
    """
    user_email = session.get('user_email')
    announcements = get_my_ads(["Tutoraggio", "Ripetizioni", "Gruppo studio"],
                               user_email)
    return jsonify(announcements)


@ad_bp.route('/personalWaitingList', methods=['GET'])
def get_personal_waitingList():
    """
    Endpoint to retrieve ads to which the logged-in user is on
      the waiting list.

    Function used from services: get_my_waitingList()

    Returns:
        *list*: List of tutoring announcements.
    """
    user_email = session.get('user_email')
    announcements = get_my_waitingList(user_email)
    return jsonify(announcements)


@ad_bp.route("/unsubscribe-waitinglist", methods=["POST"])
def unsubscribe_from_waitinglist():
    """
    Unsubscribe the currently logged-in user from a specific ad.

    This endpoint retrieves the user's email from the session and the
    advertisement ID from the request JSON payload, then calls the
    `unsubscribeStudent` function to handle the unsubscription process.

    Returns:
        tuple: A JSON response and an HTTP status code.
            - If the unsubscription is successful,
              returns a success message with a 201 status code.
    """
    user_email = session.get('user_email')
    data = request.json
    id_ad = data.get("ad_id")
    unsubscribeStudentWaitinglist(id_ad, user_email)

    return jsonify({"message": "Disiscrizione avvenuta con successo"}), 201


@ad_bp.route('/delete-ad/<int:ad_id>', methods=['DELETE'])
def delete_ad(ad_id):
    """
    Endpoint to delete an announcement posted by the logged-in user.

    Returns:
        *json*: Success or error message if a problem was
          encountered when deleting the ad
    """
    user_email = session.get('user_email')
    ad = Ad.query.filter_by(id=ad_id, student_email=user_email).first()
    if ad:
        success = delete_ad_and_notify(ad_id)
        if success:
            return jsonify({'success': 'Announcement deleted successfully'
                            }), 200
        else:
            return jsonify({
                'error': 'An error occurred while deleting the announcement'
                }), 500
    else:
        return jsonify({
            'error': 'Announcement not found or not authorized'
            }), 404
