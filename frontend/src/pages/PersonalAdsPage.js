import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
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
 * This page is designed to display personal ads posted by the logged-in user, fetched from a backend service.
 * Provides an interface where users can view and manage their ads, including the ability to delete them.
 * If the user has not yet posted any ads this page still remains viewable with the following message 
 * “Ciao! Non ci risulta che tu abbia annunci pubblicati che risultino ancora disponibili, ma puoi rimediare subito! Pubblica un annuncio” is then directed to the posting page
 * 
 * **Custom Functions**:
 * - customAlert: Displays a temporary custom alert message on the screen.
 *  
 *  **Confirm Messages**:
 * - "Annuncio eliminato con successo!" when the user clicks "Conferma" and the ad is successfully deleted
 * - "Sei sicuro di voler eliminare questo annuncio?": Displayed when the user tries to cancel a personal ad.
 * 
 */

function PersonalAdsPage({ isLoggedIn, handleLogout }) {
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

    axios.get('http://127.0.0.1:5000/personal-ads', {withCredentials: true})
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );

  function loadAnnouncements() {
    axios.get('http://127.0.0.1:5000/personal-ads', { withCredentials: true })
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Errore nel recupero degli annunci:', error);
      });
  }


  function handleDelete(adId) {
    customConfirm("Sei sicuro di voler eliminare questo annuncio?", () => {
      axios.delete(`http://127.0.0.1:5000/delete-ad/${adId}`, { withCredentials: true })
        .then(() => {
          customAlert("Annuncio eliminato con successo!", 'success');
          loadAnnouncements();
        })
        .catch(error => {
          customAlert("Errore nell'eliminazione dell'annuncio: " + error.response.data.error, 'error');
        });
    });
  }
  


  function AdCard({ ad, userEmail, isLoggedIn }) {
    const isPublishedByUser = isLoggedIn && userEmail && (ad.student_email.toLowerCase() === userEmail.toLowerCase());
  
    let buttonText;
    let buttonAction;
    let buttonDisabled = false;  
  
    if (isPublishedByUser) {
      buttonText = "ANNUNCIO PERSONALE";
      buttonDisabled = true;  
    } 

    return (
      <div className="ad-card" style={{
        background: '#E4E4E4',
      }}>
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
              {ad.location !== 'Altro' && ad.classroom && (
                <li><strong>Aula:</strong> {ad.classroom}</li>
              )}
            </ul>
          </div>
        </div>
        <div className="ad-action">
          <button className="btnTutoring"
                  disabled={buttonDisabled}
                  onClick={buttonAction}>
            {buttonText}
          </button>
          {isPublishedByUser && (
            <button className="btnDelete" onClick={() => handleDelete(ad.id)}>
              ELIMINA
            </button>
          )}
        </div>
      </div>
    );
  }
  

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
                <strong> Ciao! </strong> <br /> Non ci risulta che tu <br />abbia annunci pubblicati 
                <br />che risultino ancora disponibili,  <br />ma puoi rimediare subito!
                <br /><Link to="/new-ad" style={{ color: '#E684C3' }}>Pubblica un annuncio</Link>
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


PersonalAdsPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  ad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ad_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    description: PropTypes.string,
    student_email: PropTypes.string.isRequired,
    actual_members: PropTypes.number.isRequired,
    max_members: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    classroom: PropTypes.string,
    is_enrolled: PropTypes.bool.isRequired,
  }).isRequired,
};




export default PersonalAdsPage;
  

  