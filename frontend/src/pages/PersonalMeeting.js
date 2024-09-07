import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import logo from '../images/UniLink.png';
import '../App.css';

import Navbar from './Navbar';

const customAlert = (message, type = 'info') => {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
      alertBox.remove();
  }, 4000);
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


/**
 * 
 * This page displays tutoring and study-group announcements that are booked by the currently logged-in user.
 * Users can view details such as the type of announcement, title, subject, description, student's email, number of enrolled members,
 * maximum members allowed, hourly rate (if specified), date, time, and location.
 * Users also have the option to unsubscribe from the announcements they have booked.
 * If the user has not yet subscribed to any ads, the page still remains viewable with the following message 
 * “Ciao! Al momento non sei iscritto a nessun annuncio"
 * 
 * 
 * **Custom Functions**:
 * - customConfirm: Function to display a custom confirmation dialog box for cancelling the registration.
 * 
 *  **Confirm Messages**
 *  - "Disiscrizione avvenuta con successo": Displayed when the user successfully unsubscribes from an ad.
 *  - "Sicuro di volerti disiscrivere?": Displayed when the user needs to confirm their unsubscription from an ad.
 * 
 */
function PersonalMeeting({ isLoggedIn, handleLogout }) {
  const [announcements, setAnnouncements] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);


  useEffect(() => {

    if (isLoggedIn) {
      axios.get('http://127.0.0.1:5000/me', { withCredentials: true })
        .then(response => {
          const { email } = response.data;
          setUserEmail(email);
        })
        .catch(error => {
          console.error('Errore nel recupero delle informazioni utente:', error);
        });
    }

    axios.get('http://127.0.0.1:5000/personalMeeting', {withCredentials: true})
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );

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

  function handleUnsubscribe(adId) {
    customConfirm("Sicuro di volerti disiscrivere?", (confirmed) => {
      if (confirmed) {
        axios.post('http://127.0.0.1:5000/unsubscribe', { ad_id: adId }, {withCredentials: true})
        .then(() => {
          customAlert("Disiscrizione avvenuta con successo!", 'success');
          setAnnouncements(prevAnnouncements => prevAnnouncements.filter(ad => ad.id !== adId));
        })
        .catch(error => {
          customAlert("Errore durante la disiscrizione " + error.response.data.error, 'error');
        });
      }
    });
  };


  function AdCard({ ad }) {

    return (
      <div className="ad-card">
        <div className="ad-type-highlight">{ad.ad_type}</div>
        <h2 className="ad-title">{ad.title} - <strong>{ad.subject}</strong></h2>
        {ad.description && <p className="ad-description">{ad.description}</p>}
        <div className="ad-main-info">
          <div className="ad-left">
            <ul>
              <li className="ad-student-email"><strong>Annuncio di:</strong> {ad.student_email}</li>
              <li><strong>Iscritti:</strong> {ad.actual_members}/{ad.max_members}</li>
              {ad.rate !== -1 && <li><strong>Tariffa oraria:</strong> €{ad.rate}</li>}
            </ul>
          </div>
          <div className="ad-right">
            <ul>
              <li><strong>Data:</strong> {ad.date}</li>
              <li><strong>Ora:</strong> {ad.time}</li>
              <li><strong>Luogo:</strong> {ad.location}</li>
            </ul>
          </div>
        </div>
        <div className="ad-action">
        <button className="btnTutoring" onClick={() => handleUnsubscribe(ad.id)}>DISISCRIVIMI</button>
        </div>
      </div>
    );
  }

  const hasAnnouncements = announcements.length > 0;

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
      
      <div className="background-container">
        <div className="content" >
          {hasAnnouncements ? (
            <div className="announcement-container">
              {announcements
                .map(announcement => (
                  <AdCard key={announcement.id} ad={announcement} userEmail={userEmail} isLoggedIn={isLoggedIn}/>
              ))}
            </div>
          ) : (
            <div className="no-announcements">
              <img src={logo} alt="Logo" className="no-announcements-logo" />
              <p className="centered-text">
                <strong> Ciao! </strong> <br /> Al momento non sei iscritto a nessun annuncio
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="navbar-bottom">
        <img src={logo} className="App-logo-bottom" alt="logo" style={{ width: "60px", height: "auto", marginTop: "3px" }} />
        <p style={{ color:"white", marginTop: "6px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
      </div>
    </>
  );
}

PersonalMeeting.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ad_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    description: PropTypes.string,
    student_email: PropTypes.string.isRequired,
    actual_members: PropTypes.number.isRequired,
    max_members: PropTypes.number.isRequired,
    rate: PropTypes.number,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
  userEmail: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};



export default PersonalMeeting;
  

  