import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link} from "react-router-dom";
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
 * This page is designed to display ads for still-sellable personal books posted by the logged-in user, fetched from a backend service.
 * Provides an interface where users can view and manage their ads, including the ability to change their status to "sold".
 * If the user has not yet posted any ads this page still remains viewable with the following message 
 * “Ciao! Non hai ancora pubblicato nessun annuncio. Se vuoi pubblicarne uno, clicca qui: Vendi un libro, a presto!” is then directed to the posting page
 * 
 * **Confirm Messages**:
 * - "Congratulazioni per aver venduto il tuo libro!" When a user successfully changes the status of one's book to sold
 * 
 * **Custom Functions**:
 * - customAlert: Displays a temporary custom alert message on the screen.
 * 
 */
function PersonalBookPage({ isLoggedIn, handleLogout }) {
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

    axios.get('http://127.0.0.1:5000/personal-book', {withCredentials: true})
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );

  function loadAnnouncements() {
    axios.get('http://127.0.0.1:5000/personal-book', { withCredentials: true })
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Errore nel recupero degli annunci:', error);
      });
  }

  function handleSoldBook(adId) {
    axios.post('http://127.0.0.1:5000/sold-book', { ad_id: adId }, {withCredentials: true})
      .then(() => { 
        customAlert("Congratulazioni per aver venduto il tuo libro!", 'success');
        loadAnnouncements();
      })
  }
  

  function handleDelete(adId) {
    customConfirm("Sei sicuro di voler eliminare questo annuncio?", () => {
      axios.delete(`http://127.0.0.1:5000/delete-book/${adId}`, { withCredentials: true })
        .then(() => {
          customAlert("Annuncio eliminato con successo!", 'success');
          loadAnnouncements();
        })
        .catch(error => {
          customAlert("Errore nell'eliminazione dell'annuncio: " + error.response.data.error, 'error');
        });
    });
  }
  

  function AdCard({ ad}) {
    let buttonText;
    let buttonAction;

    buttonText = "VENDUTO";
    buttonAction = () => handleSoldBook(ad.id);  

    return (
      <div className="ad-card" style={{
        width: '750px',
        height: '250px',
        background: '#E4E4E4',
      }}>
        <h2 className="ad-title">{ad.title} - <strong>{ad.subject}</strong></h2>
        <div className="ad-main-info">
          <div className="ad-left">
            <ul>
              <li className="condition"><strong>Condizione:</strong> {ad.condition}</li>
              <li className="price"><strong>Prezzo:</strong> {ad.price}</li>
              <li className="ad-student-email"><strong>Annuncio di:</strong> {ad.student_email}</li> 
            </ul>
          </div>
          <div className="ad-action">
          <button className="btnTutoring"
            onClick={buttonAction}>
            {buttonText}
          </button>
          <button className="btnDelete" onClick={() => handleDelete(ad.id)}>
              ELIMINA
           </button>
        </div>
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
              <strong> Ciao! Non hai ancora pubblicato nessun annuncio. <br /> 
                Se vuoi pubblicarne uno, clicca qui: 
                <Link to="/new-book" style={{ color: '#E684C3', textDecoration: 'underline', display: 'block', marginBottom: '10px' }}>
                  Vendi un libro
                </Link>
                a presto! </strong> <br /> 
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

PersonalBookPage.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    student_email: PropTypes.string.isRequired,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};


export default PersonalBookPage;
  

  