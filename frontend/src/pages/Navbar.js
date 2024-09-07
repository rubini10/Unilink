import PropTypes from 'prop-types';
import React from "react";
import logo from '../images/UniLink.png';
import { FiUser } from "react-icons/fi";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

/**
 * **Navbar Component**
 * 
 * This component represents the navigation bar for the application, handling both the logged-in and
 * logged-out states. It includes links to various pages and functionalities depending on the user's 
 * authentication status. Additionally, it manages the visibility of the menu and displays notifications.
 * 
 * **Custom Functions**:
 * - `handleLogoutClick`: Handles the logout process by showing a custom confirmation dialog and performing
 *   necessary actions like sending a logout request, calling `handleLogout`, clearing user email, and navigating
 *   to the home page.
 * - `customConfirm`: Displays a custom confirmation dialog box with a message and callback function. It creates 
 *   a dialog with "Conferma" and "Annulla" buttons to confirm or cancel the action, respectively.
 * 
 * **Menu Options**:
 * - If the user is logged in, the menu includes links to:
 *   - Home (HomePage)
 *   - Notifications (NotificationsPage)
 *   - Profile (MyProfile)
 *   - Personal Ads (PersonalAdsPage)
 *   - Personal Meetings (PersonalMeeting)
 *   - Published Books (PersonalBook)
 *   - Sold Books (PersonalBookSold)
 *   - Personal waiting list (PersonalWaitingList)
 *   - New Ad (NewAdPage)
 *   - Sell Book (NewBookPage)
 *   - Logout
 * - If the user is not logged in, the menu includes links to:
 *   - Home (HomePage)
 *   - Signup (RegisterPage)
 *   - Login
 */
function Navbar({ isLoggedIn, menuOpen, hasUnreadNotifications, handleLogout, setMenuOpen, setUserEmail }) {

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        customConfirm("Sicuro di voler lasciare il tuo profilo?", (confirmed) => {
          if (confirmed) {
            axios.post('http://127.0.0.1:5000/logout') 
            handleLogout(); 
            setUserEmail("");
            navigate("/");
          }
        });
       };

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


    return (
        <div className="navbar" style={{ backgroundColor: "#4B4F5C", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0" }}>
        <div>
            <img src={logo} className="App-logo" alt="logo" style={{ width: "100px", height: "auto" }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "20px", marginLeft: "auto", fontWeight: "bold", fontSize: "16px" }} >Home</Link>
            {isLoggedIn && (
            <div>
                <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
                <div className="notification-icon">
                    {hasUnreadNotifications && <span className="notification-alert"></span>}
                    <FiUser style={{ color: 'white', fontSize: '24px' }} />
                </div>
                </div>
                {menuOpen && (
                <div style={{ position: 'absolute', top: '30px', right: '0', backgroundColor: '#4B4F5C', padding: '10px', borderRadius: '5px', width: '150px', marginTop: '10px' }}>
                    <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Notifiche {hasUnreadNotifications && <span className="notification-alert"></span>}</Link>
                    <Link to="/my-profile" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Profilo</Link>
                    <Link to="/personal-ads" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Annunci pubblicati</Link>
                    <Link to="/personal-meeting" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Prenotazioni</Link>
                    <Link to="/personal-book" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Libri pubblicati</Link>
                    <Link to="/personal-book-sold" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Libri venduti</Link>
                    <Link to="/personal-waiting-list" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Lista d&apos;attesa</Link>
                    <Link to="/new-ad" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Pubblica annuncio</Link>
                    <Link to="/new-book" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Vendi libro</Link>
                    <Link style={{ color: 'white', textDecoration: 'none', display: 'block' }} onClick={handleLogoutClick}>Logout</Link>
                </div>
                )}
            </div>
            )}
        </div>
        </div>
    );
}

Navbar.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    hasUnreadNotifications: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired,
    setMenuOpen: PropTypes.func.isRequired,
    setUserEmail: PropTypes.func.isRequired
  };

export default Navbar;
