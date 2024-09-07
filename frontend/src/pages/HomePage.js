import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logo from '../images/UniLink.png'; 
import '../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { FiUser } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, right: "10%", zIndex: "1", display: "block", background: "#4B4F5C", borderRadius: "50%"}}
      onClick={onClick}
    />
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, left: "10%", zIndex: "1", display: "block", background: "#4B4F5C", borderRadius: "50%"}}
      onClick={onClick}
    />
  );
}

/**
 * 
 * This is the landing page for UniLink, providing information on the platform's features and functionalities to potential users. 
 * It includes a carousel of slides illustrating various aspects of the platform, such as tutoring and study groups announcements, and the book-shop. 
 * Each section of the carousel links to the corresponding page.
 * 
 */
function HomePage({ isLoggedIn, handleLogout  }) {


  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 550,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: true,
    centerPadding: "25%", 
    responsive: [
    {
      breakpoint: 768, 
      settings: {
        arrows: false, 
        centerPadding: "10%",
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        centerPadding: "10%"
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        arrows: false,
        centerPadding: "10px"
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        arrows: false,
        centerPadding: "0px"
      }
    }
    ]  
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



  const handleLogoutClick = () => {
    customConfirm("Sicuro di voler lasciare il tuo profilo?", (confirmed) => {
      if (confirmed) {
        axios.post('http://127.0.0.1:5000/logout') 
        handleLogout(); 
      }
    });
  };

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

  return (
    <div className="App">
      {/* Navigation bar */}
      <div className="navbar" style={{ backgroundColor: "#4B4F5C", padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0", zIndex: "1" }}>
        <div>
          <img src={logo} className="App-logo" alt="logo" style={{ width: "100px", height: "auto", marginBottom: "1px", marginLeft: "2px" }} />
        </div>
        {isLoggedIn ? (
          <div>
            <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
                <div className="notification-icon">
                    {hasUnreadNotifications && <span className="notification-alert"></span>}
                    <Link to="/help" className="settings-button2"><IoInformationCircleOutline  color="white"  size={24} style={{ marginRight: '10px' }}/></Link>
                    <FiUser style={{ color: 'white', fontSize: '24px' }} />
                </div>
            </div>
            {menuOpen && (
    <div style={{ position: 'absolute', top: '30px', right: '0', backgroundColor: '#4B4F5C', padding: '10px', borderRadius: '5px', width: '150px', marginTop: '10px', textAlign: 'left' }}>
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/help" className="settings-button2"><IoInformationCircleOutline  color="white"  size={24} style={{ marginRight: '10px', marginTop: '8px' }}/></Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold" }}>Signup</Link>
            <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold" }}>Login</Link>
          </div>
        )}
      </div>     

      <div className="video-container">
        <video
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.9
          }}
          autoPlay
          muted
          loop
        >
          <source src="https://videos.pexels.com/video-files/6192773/6192773-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>

        <img
          src={logo}
          className="unilink-logo"
          alt="logo"
        />

        <div className="video-overlay">
          <h1>
            Benvenuti su UniLink, <span style={{ fontStyle: "italic", fontWeight: "bold" }}>il filo conduttore tra gli studenti</span>.<br />
            Trova supporto per le ripetizioni, collabora con tutor, <br /> forma gruppi di studio dinamici e dai una seconda vita a libri usati. <br />
            Unisciti a noi e trasforma il tuo percorso accademico!
          </h1>
        </div>
      </div>


      {/* Slider */}
      <Slider {...settings}>
        {/* Slide 1 */}
        <div className="slider-container">
          <Link to="/tutoring" style={{ textDecoration: "none" }}>
            <div className="slider-overlay">Ripetizioni - Tutoraggio</div>
              <img
                src="https://images.pexels.com/photos/6238038/pexels-photo-6238038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Ripetizioni - Tutoraggio"
                className="slider-image"
              />
          </Link>
        </div>
        {/* Slide 2 */}
        <div className="slider-container">
          <Link to="/study-group" id="study-group-link" style={{ textDecoration: "none" }}>
            <div className="slider-overlay">Gruppi Studio</div>
            <img
              src="https://images.pexels.com/photos/3471028/pexels-photo-3471028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Gruppi Studio"
              className="slider-image"
            />
          </Link>
        </div>
        {/* Slide 3 */}
        <div className="slider-container">
          <Link to="/book-shop" style={{ textDecoration: "none" }}>
            <div className="slider-overlay">Book Shop</div>
            <img
              src="https://images.pexels.com/photos/7341300/pexels-photo-7341300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Book Shop"
              className="slider-image"
            />
          </Link>
        </div>
      </Slider>
      
      {/* Bottom bar */}
      <div className="navbar-bottom">
        <img src={logo} className="App-logo-bottom" alt="logo" style={{ width: "60px", height: "auto" }} />
        <p style={{ color:"white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

NextArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

PrevArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};



export default HomePage;
