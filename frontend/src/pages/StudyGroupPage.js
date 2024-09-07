import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import {useNavigate, Link} from "react-router-dom";
import logo from '../images/UniLink.png';
import '../App.css';
import { FcSettings } from "react-icons/fc";

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

/**
 * 
 * This page displays study group announcements retrieved from the server. Users can view study group details
 * such as the title, subject, description, date, time, location, and the number of enrolled members. Users can
 * also enroll in study groups if they are logged in or are prompted to log in if they are not.
 * Additionally, users can join a waiting list if there are no available spots for the announcement.
 * If no ads are available this page still remains viewable with the following message
 * “Ciao! Al momento non ci sono annunci disponibili, riprova più tardi o pubblica un nuovo annuncio, a presto!" is then directed to the posting page
 * 
 * **Custom Functions**:
 * - customAlert: Function to display a custom alert message for a specified duration. 
 * 
 * **Confirm message**:
 * - "Iscrizione avvenuta con successo!" When a user is successfully enrolled in the ad
 * - "Iscrizione alla lista d'attesa avvenuta con successo!" When a user is successfully enrolled in the ad waiting list 
 * 
 * **Redirect**:
 * - If the user is not logged in and tries to enroll in a study group, they are redirected to the login page ("/login"). With the following message:
 * "Ciao e benvenuto! Per iscriversi ad un evento occorre essere loggati. Effettua la login, e goditi UniLink grazie!"
 */
function StudyGroupPage({ isLoggedIn, handleLogout }) {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
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

    axios.get('http://127.0.0.1:5000/study-group')
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );


  function loadAnnouncements() {
    axios.get('http://127.0.0.1:5000/study-group', { withCredentials: true })
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Errore nel recupero degli annunci:', error);
      });
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

  function handleEnrollment(adId) {
    if (!isLoggedIn) {
      customAlert("Ciao e benvenuto! \nPer iscriversi ad un evento \noccorre essere loggati. \nEffettua la login, e goditi UniLink \ngrazie!", 'error');
      setTimeout(() => {
        navigate("/login");
      }, 0.0); 
    } else {
      axios.post('http://127.0.0.1:5000/enroll', { ad_id: adId }, {withCredentials: true})
      .then(() => { 
        customAlert("Iscrizione avvenuta con successo!", 'success');
        loadAnnouncements();
      })
      .catch(error => {
        customAlert("Errore nell'iscrizione: " + error.response.data.error, 'error');
      });
    }
  }



  function handleWaitingList(adId) {
    if (!isLoggedIn) {
      customAlert("Ciao e benvenuto! \nPer iscriversi ad un evento \noccorre essere loggati. \nEffettua la login, e goditi UniLink \ngrazie!", 'error');
      setTimeout(() => {
        navigate("/login");
      }, 0.0); 
    } else {
      axios.post('http://127.0.0.1:5000/waiting-list', { ad_id: adId }, {withCredentials: true})
      .then(() => { 
        customAlert("Iscrizione alla lista d'attesa avvenuta con successo!", 'success');
        loadAnnouncements();
      })
      .catch(error => {
        customAlert("Errore nell'iscrizione: " + error.response.data.error, 'error');
      });
    }
  }


  const handleNewAdClick = (event) => {
    event.preventDefault();
  
    if (!isLoggedIn) {
      customAlert("Ciao e benvenuto! \nPer pubblicare un annuncio \noccorre essere loggati. \nEffettua la login, e goditi UniLink \ngrazie!", 'error');
      navigate("/login");
    } else {
      navigate("/new-ad");
    }
  };
  

  function AdCard({ ad, userEmail, isLoggedIn }) {
    const isPublishedByUser = isLoggedIn && userEmail && (ad.student_email.toLowerCase() === userEmail.toLowerCase());
    const isFull = ad.actual_members >= ad.max_members;
    const isEnrolled = isLoggedIn && ad.enrolled_users && ad.enrolled_users.includes(userEmail.toLowerCase());
    const isInWaitingList = isLoggedIn && ad.waiting_list_users && ad.waiting_list_users.includes(userEmail.toLowerCase());
  
    let buttonText, buttonAction;
    let buttonDisabled = false;
    let settingsLink = null; 
  
    if (isPublishedByUser) {
      buttonText = "ANNUNCIO PERSONALE";
      buttonDisabled = true;
      settingsLink = "/personal-ads"; 
    } else if (isEnrolled) {
      buttonText = "ISCRITTO";
      buttonDisabled = true;
      settingsLink = "/personal-meeting"; 
    } else if (isInWaitingList) {
      buttonText = "IN LISTA D'ATTESA";
      buttonDisabled = true;
      settingsLink = "/personal-waiting-list"; 
    } else if (isFull) {
      buttonText = "ENTRA IN LISTA D'ATTESA";
      buttonAction = () => handleWaitingList(ad.id);
    } else {
      buttonText = "ISCRIVIMI";
      buttonAction = () => handleEnrollment(ad.id);
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
          <button className="btnTutoring" disabled={buttonDisabled} onClick={buttonAction}>
            {buttonText}
          </button>
          {settingsLink && (
            <Link to={settingsLink} className="settings-button" title="Gestisci">
              <FcSettings size={24} />
            </Link>
          )}
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
                <strong> Ciao! </strong> <br /> Al momento non ci sono annunci disponibili, <br />riprova più tardi <br />
                <span>
                  o{' '}
                  <Link to={isLoggedIn ? "/new-ad" : "/login"} onClick={handleNewAdClick} style={{ color: '#E684C3', textDecoration: 'underline' }}>
                    pubblica un nuovo annuncio
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

StudyGroupPage.propTypes = {
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
    classroom: PropTypes.string,
    enrolled_users: PropTypes.arrayOf(PropTypes.string),
    waiting_list_users: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  userEmail: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};


export default StudyGroupPage;
  

  