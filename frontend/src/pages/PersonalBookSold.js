import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link} from "react-router-dom";
import logo from '../images/UniLink.png';
import '../App.css';

import Navbar from './Navbar';


/**
 * 
 * This page is designed to display ads for no-longer-saleable personal book posted by the logged-in user, fetched from a backend service.
 * Provides an interface where users can view their ads.
 * If the user has not yet posted any ads this page still remains viewable with the following message 
 * “Ciao! Non hai ancora venduto nessun libro. Per monitorare i tuoi annunci, clicca qui: I miei libri pubblicati a presto!” is then directed to the monitoring page of its book ads listings
 * 
 */
function PersonalBookSoldPage({ isLoggedIn, handleLogout }) {
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

    axios.get('http://127.0.0.1:5000/personal-book-sold', {withCredentials: true})
      .then(response => {
        console.log(response.data);
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, );


  function AdCard({ ad}) {

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
              <strong> Ciao! </strong> <br /> 
                Non hai ancora venduto nessun libro. <br /> 
                Per monitorare i tuoi annunci, clicca qui: 
                <Link to="/personal-book" style={{ color: '#E684C3', textDecoration: 'underline', display: 'block', marginBottom: '10px' }}>
                  I miei libri pubblicati
                </Link>
                a presto! <br /><br />
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

PersonalBookSoldPage.propTypes = {
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


export default PersonalBookSoldPage;
  

  