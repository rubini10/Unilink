import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from 'axios';
import logo from '../images/UniLink.png';
import '../App.css';
import { FcSettings } from "react-icons/fc";

import Navbar from './Navbar';

/**
 * 
 * This page displays book-shop announcements retrieved from the server. Users can view books details
 * such as the title, subject, condition, price.
 * The logged-in user can choose to notify the author of the ad that he is interested in the book; 
 * this feature is available if a notification has not already been sent and if the ad has not been published by the logged-in user.
 * Users can notify only if they are logged in or are prompted to log in if they are not.
 * If no ads are available this page still remains viewable with the following message 
 * "Ciao! Al momento non ci sono annunci disponibili, riprova più tardi o pubblica un nuovo annuncio, a presto!" is then directed to the posting page
 * 
 *  **Custom Functions**:
 * - customAlert: Function to display a custom alert message for a specified duration.
 * 
 * **Confirm message**:
 * - "Chi ha pubblicato l'annuncio è stato notificato del tuo interessamento, aspetta di essere contattato o mandagli un email!" When the author of the ad is successfully notified
 * 
 * **Redirect**:
 * - If the user is not logged in and tries to enroll in a study group, they are redirected to the login page ("/login"). With the following message:
 * "Ciao e benvenuto! Per notificare l'autore dell'ad occorre essere loggati. Effettua la login, e goditi UniLink grazie!"
 */
function BookShopPage({ isLoggedIn, handleLogout }) {
  const [announcements, setAnnouncements] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

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

    axios.get('http://127.0.0.1:5000/book-shop', {withCredentials: true})
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );

  function loadAnnouncements() {
    axios.get('http://127.0.0.1:5000/book-shop', { withCredentials: true })
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Errore nel recupero degli annunci:', error);
      });
  }

  const customAlert = (message, type = 'info') => {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    alertBox.textContent = message;
  
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
        alertBox.remove();
    }, 4000);
  };

  function handleNotificationBook(adId) {
    if (!isLoggedIn) {
      customAlert("Ciao e benvenuto! \nPer notificare l'autore dell'ad \noccorre essere loggati. \nEffettua la login, e goditi UniLink \ngrazie!", 'error');
      setTimeout(() => {
        navigate("/login");
      }, 0.0); 
    } else {
      axios.post('http://127.0.0.1:5000/notificate-book', { ad_id: adId }, {withCredentials: true})
      .then(() => {
        customAlert("Chi ha pubblicato l'annuncio è stato notificato del tuo interessamento, aspetta di essere contattato o mandagli un email!", 'success');
        loadAnnouncements();
      })
    }
  }



  const handleNewAdClick = (event) => {
    event.preventDefault();
  
    if (!isLoggedIn) {
      customAlert("Ciao e benvenuto! \nPer pubblicare un annuncio \noccorre essere loggati. \nEffettua la login, e goditi UniLink \ngrazie!", 'error');
      navigate("/login");
    } else {
      navigate("/new-book");
    }
  };

  function AdCard({ ad, userEmail, isLoggedIn }) {
  const isPublishedByUser = isLoggedIn && userEmail && (ad.student_email.toLowerCase() === userEmail.toLowerCase());
  const isNotificate = isLoggedIn && ad.notified_users

  let buttonText;
  let buttonAction;
  let buttonDisabled = false;  

  if (isPublishedByUser) {
    buttonText = "ANNUNCIO PERSONALE";
    buttonDisabled = true;  
  } else if (isNotificate) {
    buttonText = "NOTIFICATO";
    // eslint-disable-next-line no-unused-vars
    buttonDisabled = true;  
  } else {
    buttonText = "MI INTERESSA";
    buttonAction = () => handleNotificationBook(ad.id);  
  }

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
          {isPublishedByUser && (
          <Link to="/personal-book" className="settings-button" title="Gestisci">
            <FcSettings size={24} />
          </Link>
          )}
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
                <strong> Ciao! </strong> <br /> Al momento non ci sono annunci disponibili, <br />riprova più tardi <br />
                <span>
                  o{' '}
                  <Link to={isLoggedIn ? "/new-book" : "/login"} onClick={handleNewAdClick} style={{ color: '#E684C3', textDecoration: 'underline' }}>
                    pubblica un nuovo libro
                  </Link>
                </span>
                <br />a presto!
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

BookShopPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  ad: PropTypes.object.isRequired,
  userEmail: PropTypes.string.isRequired,
};



export default BookShopPage;
  

  