import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../App.css';
import logo from '../images/UniLink.png';

import Navbar from './Navbar';
  
  const customConfirm = (message, callback) => {
    const confirmBox = document.createElement('div');
    confirmBox.className = 'custom-alert success'; 
  
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    confirmBox.appendChild(messageElement);
  
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Conferma';
    confirmButton.className = 'custom-confirm-button'; 
    confirmButton.style.height = '25px';
    confirmButton.addEventListener('click', () => {
        document.body.removeChild(confirmBox);
        callback(true); 
    });
    confirmBox.appendChild(confirmButton);
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Annulla';
    cancelButton.className = 'custom-confirm-button'; 
    cancelButton.style.height = '25px';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(confirmBox);
        callback(false); 
    });
    confirmBox.appendChild(cancelButton);
  
    confirmBox.style.top = '25%'; 
    confirmBox.style.backgroundColor = 'rgba(124, 61, 64, 0.95)'; 
  
    document.body.appendChild(confirmBox);
  
  };



/**
 * This page displays notifications for the logged-in user. It includes a list of notifications
 * with options to mark them as read or delete them.
 * 
 * **Components**:
 * - NotificationCard: A component rendering individual notification cards with options to remove them.
 * 
 * **Custom Functions**:
 * - customConfirm: A custom function for displaying a confirmation dialog box with "Conferma" and "Annulla" buttons.
 * 
 * **API Requests**:
 * - GET /me: Retrieves user information, such as email, for the logged-in user.
 * - GET /notifications: Retrieves notifications for the logged-in user.
 * - GET /notifications/unread-count: Retrieves the count of unread notifications for the logged-in user.
 * - POST /notifications/mark-as-read: Marks all notifications as read for the logged-in user.
 * - DELETE /notifications/:id: Deletes a specific notification for the logged-in user.
 * 
 * **Error Handling**:
 * - If the user is not logged in, they are redirected to the login page ("/login").
 * - Errors during API requests are logged to the console.
 * 
 * **State**:
 * - notifications: An array containing notification objects fetched from the server.
 * - userEmail: A string containing the email address of the logged-in user.
 * - menuOpen: A boolean value indicating whether the user menu is open.
 * - hasUnreadNotifications: A boolean value indicating whether there are unread notifications.
 * 
 * **User Actions**:
 * - Clicking on the user icon toggles the display of the user menu.
 * - Clicking on a notification's close button removes the notification.
 * - Clicking on "Logout" in the user menu prompts the user to confirm logout.
 * 
 * **UI Elements**:
 * - Navbar: A navigation bar with a logo, home link, and user menu.
 * - Notification Cards: Cards displaying individual notifications with options to remove them.
 * - Background Container: A container with background styling.
 * - "No Notifications" Message: Displayed when there are no notifications to show.
 * 
 * **Redirect**:
 * - If the user is not logged in, they are redirected to the login page ("/login").
 * 
 * **API Integration**:
 * - Uses axios for making API requests to the backend server.
 */

function NotificationsPage({ isLoggedIn, handleLogout }) {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            axios.get('http://127.0.0.1:5000/me', { withCredentials: true })
                .then(response => {
                    const { email } = response.data;
                    console.log("User email:", email);
                    setUserEmail(email);
                })
                .catch(error => {
                    console.error('Errore nel recupero delle informazioni utente:', error);
                });

            axios.get('http://127.0.0.1:5000/notifications', { withCredentials: true })
                .then(response => {
                    console.log("Notifications from backend:", response.data);
                    const filteredNotifications = response.data.filter(notification => notification.student_email === userEmail);
                    console.log("Filtered notifications:", filteredNotifications); 
                    setNotifications(filteredNotifications);
                    axios.post('http://127.0.0.1:5000/notifications/mark-as-read', {}, { withCredentials: true })
                    .then(() => setHasUnreadNotifications(false))
                    .catch(error => console.error('Error marking notifications as read:', error));
            })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [isLoggedIn, navigate, userEmail]);

    useEffect(() => {
        if (isLoggedIn) {
            axios.get('http://127.0.0.1:5000/notifications/unread-count', { withCredentials: true })
                .then(response => {
                    if (response.data.unread_count > 0) {
                        setHasUnreadNotifications(true);
                    } else {
                        setHasUnreadNotifications(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching unread notifications count:', error);
                });
        }
    }, [isLoggedIn]);

    function NotificationCard({ notification, removeNotification }) {
        return (
            <div className="notification-card">
                <button className="close-btn" onClick={() => removeNotification(notification.id)}>x</button>
                <div className="notification-content" dangerouslySetInnerHTML={{ __html: notification.message }}></div>
                <p className="notification-date">Data: {notification.date_created}</p>
            </div>
        );
    }

    const removeNotification = (id) => {
        customConfirm("Sicuro di voler eliminare la notifica?", (confirmed) => {
          if (confirmed) {
            axios.delete(`http://127.0.0.1:5000/notifications/${id}`, { withCredentials: true })
              .then(() => {
                setNotifications(notifications.filter(notification => notification.id !== id));
                console.log('Notification deleted successfully');
              })
              .catch(error => {
                console.error('Error deleting notification:', error);
              });
          }
        });
      };
      

    return (
        <>
        <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            hasUnreadNotifications={hasUnreadNotifications}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            setUserEmail={setUserEmail}
        />
                <div className="background-container2">
                    <div className="content2">
                        {notifications.length > 0 ? (
                            <div className="notifications-container">
                                {notifications.map(notification => (
                                    <NotificationCard key={notification.id} notification={notification} removeNotification={removeNotification} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-announcements">
                                <img src={logo} alt="Logo" className="no-announcements-logo" />
                                <p className="centered-text">
                                    <strong> Ciao! </strong> <br /> Al momento non ci sono nuove notifiche, <br />a presto!
                                </p>
                        </div>
                        )}
                    </div>
                </div>
            </>
    );
}

NotificationsPage.propTypes = {
    notification: PropTypes.shape({
        id: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        date_created: PropTypes.string.isRequired
      }).isRequired,
    removeNotification: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired
  };





export default NotificationsPage;
