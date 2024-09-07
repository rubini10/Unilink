import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from '../images/UniLink.png';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css'; 

import Navbar from './Navbar';

const customAlert = (message, type = 'info') => {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
      alertBox.remove();
  }, 2000);
};


/**
 * 
 * This page allows users to create a new ad to offer used books for sale.
 * Users can enter details such as title, subject, condition of the book, price
 * After filling in the required fields, users can publish the ad, and it will be displayed on the platform.
 * 
 * **Custom Functions**:
 * - customAlert: Function to display a custom alert message for a specified duration.
 * 
 * **Error Messages**:
 * - "Per favore, completa i campi contrassegnati con l'asterisco": Displayed when the user tries to publish the ad without filling out all the required fields.
 * 
 * **Confirm Messages**
 *  - "Sicuro di non voler più pubblicare?": Displayed when the user tries to cancel creating a new book ad.
 * 
 * **Redirect**:
 * - After successful ad creation, the user is redirected to the home page ("/").
 * 
 */
export default function NewBookPage({ isLoggedIn, handleLogout }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // Added initialization
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [, setUserEmail] = useState("");


  const customConfirm = (message, callback) => {
    const confirmBox = document.createElement('div');
    confirmBox.className = 'custom-alert success'; 

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    confirmBox.appendChild(messageElement);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Conferma';
    confirmButton.className = 'custom-confirm-button'; 
    confirmButton.addEventListener('click', () => {
        document.body.removeChild(confirmBox);
        callback(true); 
    });
    confirmBox.appendChild(confirmButton);
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Annulla';
    cancelButton.className = 'custom-confirm-button'; 
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(confirmBox);
        callback(false); 
    });
    confirmBox.appendChild(cancelButton);

    document.body.appendChild(confirmBox);
  };

  const handleCancel = () => {
    customConfirm("Sicuro di non voler più pubblicare?", (confirmed) => {
        if (confirmed) {
            navigate("/");
        }
    });
};

  const handleNewBook = () => {
    let missingFields = [];
    
    if (!title) missingFields.push('titolo');
    if (!subject) missingFields.push('materia');
    if (!price) missingFields.push('prezzo');
    if (!condition) missingFields.push('condizione');

    if (missingFields.length > 0) {
      customAlert(`Per favore, completa i campi contrassegnati con l'asterisco`, 'warning');
      return; 
    }

    axios.post('http://127.0.0.1:5000/new-book', {
      title: title,
      subject: subject,
      price: price,
      condition: condition
    }, {
      withCredentials: true 
    })
    .then(function (response) {
      console.log(response);
      navigate("/");
    });
  };

  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
    }
  }, []);

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
    <div style={{ minHeight: "100vh" }}>
        <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            hasUnreadNotifications={hasUnreadNotifications}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            setUserEmail={setUserEmail}
        />

        <div style={{
                    display: "flex",
                    justifyContent: "center", 
                    alignItems: "center", 
                    height: "calc(100vh - 60px)", 
                    padding: "20px",
                    overflowX: "hidden" 
                    }}>

            <div style={{
                maxWidth: '400px',
                width: '100%',
                padding: '20px',
                backgroundColor: 'rgba(227, 226, 227, 0.9)',
                borderRadius: '0px',
                marginRight: '10px' 
                }}>
                <h2 style={{ marginBottom: '20px', textAlign: "center", color: "#4B4F5C" }}>Pubblica l&apos;annuncio per vendere il tuo libro</h2>
                <div>
                    <label htmlFor="titolo">Titolo*</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="materia">Materia*</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="prezzo">Prezzo*</label>
                    <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required style={{ width: '100%' }} />
                </div>
                <div>
                    <label htmlFor="condizione">Condizione*</label>
                    <select value={condition} onChange={(e) => setCondition(e.target.value)} required style={{ width: '100%' }}>
                    <option value="">Seleziona la condizione</option>
                    <option value="Nuovo">Nuovo, mai usato</option>
                    <option value="Buone condizioni">In buone condizioni</option>
                    <option value="Utilizzabile">Visibilmente usato</option>
                    </select>
                </div>
                <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                  <button className="btn2" type="button" onClick={handleCancel}>Annulla</button>
                     <div style={{ margin: '0 10px' }}></div> 
                  <button className="btn2" type="submit" onClick={handleNewBook}>Pubblica</button>
                </div>
            </div>

            <div className="animated-image"></div>
    </div>

      <div className="navbar-bottom">
        <img src={logo} className="App-logo" alt="logo" style={{ width: "60px", height: "auto" }} />
        <p style={{ color: "white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
      </div>
    </div>
  );
}

NewBookPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
