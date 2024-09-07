import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from '../images/UniLink.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css'; 
import AddressAutocomplete from './Autocomplete';

import Navbar from './Navbar';



/**
 * 
 * This page allows users to create a new advertisement for services such as tutoring and study groups.
 * Users can input details such as title, description, date, time, location, maximum number of participants,
 * subject, advertisement type, and rate. After filling out the required fields, users can publish the ad,
 * and it will be displayed on the platform.
 * 
 * **Custom Functions**:
 * - customAlert: Function to display a custom alert message for a specified duration.
 * 
 * **Error Messages**:
 * - "Per favore, completa i campi contrassegnati con l'asterisco": Displayed when the user tries to publish the ad without filling out all the required fields.
 * 
 * **Confirm Messages**
 *  - "Sicuro di non voler più pubblicare?": Displayed when the user tries to cancel creating a new ad.
 * 
 * **Redirect**:
 * - After successful ad creation, the user is redirected to the home page ("/").
 * 
 */
export default function NewAdPage({ isLoggedIn, handleLogout }){

  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [classroom, setClassroom] = useState('');
  const [max_members, setMaxMembers] = useState(1);
  const [subject, setSubject] = useState('');
  const [adType, setAdType] = useState('');
  const [rate, setRate] = useState('');
  const [otherLocation, setOtherLocation] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [, setUserEmail] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setLocation(value);
  };

  const customAlert = (message, type = 'info') => {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    alertBox.textContent = message;


    document.body.appendChild(alertBox);


    setTimeout(() => {
        alertBox.remove();
    }, 2000);
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


    const handleNewAd = () => {
    let missingFields = [];
    
    if (!title) missingFields.push('titolo');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!location) missingFields.push('location');
    if (location === "Altro") {
      if (!otherLocation) missingFields.push('otherLocation');
    } else {
      if (!classroom) missingFields.push('classroom');
    }
    if (!max_members) missingFields.push('maxMembers');
    if (!subject) missingFields.push('subject');
    if (!adType) missingFields.push('adType');
    if (adType==="Ripetizioni") {
      if (!rate) missingFields.push('rate');
    }


    if (missingFields.length > 0) {
      customAlert(`Per favore, completa i campi contrassegnati con l'asterisco`, 'warning');
      return; 
    }

    if (location === "Altro") {
      axios.post('http://127.0.0.1:5000/new-ad', {
        title: title,
        description: description,
        date: date.toISOString(),
        time: time,
        location: otherLocation,
        max_members: max_members,
        subject: subject,
        adType: adType,
        rate: rate
      }, {
        withCredentials: true 
      })
      .then(function (response) {
        console.log(response);
        navigate("/");
      });
    } else {
      axios.post('http://127.0.0.1:5000/new-ad', {
        title: title,
        description: description,
        date: date.toISOString(),
        time: time,
        location: location,
        classroom: classroom, 
        max_members: max_members,
        subject: subject,
        adType: adType,
        rate: rate
      }, {
        withCredentials: true 
      })
      .then(function (response) {
        console.log(response);
        navigate("/");
      });
    }



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
      <div>
        <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            hasUnreadNotifications={hasUnreadNotifications}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
            setUserEmail={setUserEmail}
        />
    
          <div style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%", 
                  height: "100%", 
                  overflow: "hidden", 
                  zIndex: "-1", 
              }}>
              <video 
                  autoPlay 
                  muted 
                  preload="auto"
                  ref={videoRef}
                  style={{ 
                  position: "absolute", 
                  width: "180%", 
                  height: "130%", 
                  objectFit: "cover", 
                  opacity: "0.8",
                  transform: "translate(-15%, -2%)"
                  }}>
                  <source src="https://videos.pexels.com/video-files/4068356/4068356-uhd_4096_2160_25fps.mp4" type="video/mp4" />
              </video>
            </div>
    
            <div style={{ 
              position: 'relative',
              maxWidth: '400px', 
              width: '100%',
              marginRight: '100px',
              borderRadius: '0px',
              display: 'grid',
              gap: '15px',
              marginLeft: '110px',
              marginTop: '-20px',
              backgroundColor: 'rgba(227, 226, 227, 0.9)',
              padding: '10px', 
              gridTemplateColumns: '1fr 1fr', 
              gridTemplateRows: 'auto auto auto auto auto', 
              gridTemplateAreas: `
                "titolo titolo"
                "description description"
                "data ora"
                "luogo luogo2"
                "max_members materia"
                "tipologia retribuzione"
                "action action"
              `
            }}>
                
                <div style={{ gridArea: 'titolo', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="Titolo" className="form-label">Titolo*</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Inserisci il titolo dell'annuncio" 
                    maxLength="50" 
                    required 
                    style={{ height: '20px', width: '380px', border: 'none', outline: 'none'}} 
                  />
                </div>


                <div style={{ gridArea: 'materia' }}>
                  <label htmlFor="Materia" className="form-label">Materia*</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Materia" maxLength="45" required style={{ height: '20px', border: 'none' }} />
                </div>
                

                <div style={{ gridArea: 'description', gridColumn: '1 / -1' }}>
                  <label htmlFor="description" className="form-label" style={{ display: 'block' }}>Descrizione</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setdescription(e.target.value)} 
                    placeholder="Descrivi l'argomento dell'incontro" 
                    maxLength="500" 
                    style={{ 
                      display: 'block', 
                      width: '360px', 
                      height: '50', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px', 
                      padding: '10px', 
                      resize: 'vertical', 
                      fontFamily: 'sans-serif'
                    }} 
                  />
                </div>

                <div className="data_newAd" style={{ maxWidth: '200px',  gridArea: 'data'  }}>
                          <label htmlFor="Data" className="form-label">Data*</label>
                          <DatePicker selected={date} 
                          onChange={(date) => setDate(date)} 
                          placeholderText="Data" 
                          dateFormat="dd/MM/yyyy" 
                          minDate={tomorrow}
                          required 
                          style={{ height: '50px', borderStyle: 'none', borderRadius: '5px', padding: '10px', fontSize: '16px', width: '100%' }} 
                          />
                </div>
                
                <div style={{ gridArea: 'ora', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="Ora" className="form-label">Ora*</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    required 
                    style={{ height: '20px', borderStyle: 'none', width: '172px' }} 
                  />
                </div>



                <div style={{ gridArea: 'luogo', display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="Luogo" className="form-label">Luogo*</label>
                  <select 
                    value={location} 
                    onChange={handleLocationChange} 
                    required
                    style={{ 
                      height: '24px', 
                      borderStyle: 'none', 
                      padding: '5px',
                      fontSize: '12px',
                      width: '175px'
                    }}
                  >
                    <option value="">Seleziona un luogo</option>
                    {['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U9', 'U10', 'U12', 'U14', 'U16', 'U17', 'U24', 'Altro'].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>            
                </div>

                {location !== 'Altro' && (
                  <div style={{ gridArea: 'luogo2' }}>
                    <label htmlFor="Aula" className="form-label">Aula*</label>
                    <input 
                      type="text" 
                      value={classroom} 
                      onChange={(e) => setClassroom(e.target.value)} 
                      placeholder="Aula" 
                      maxLength="5" 
                      required 
                      style={{ borderStyle: 'none', height: '20px'}} 
                    />
                  </div>
                )}

                {location === 'Altro' && (
                <div style={{ gridArea: 'luogo2' }}>
                  <label htmlFor="location2" className="form-label">Indirizzo*</label>
                    <AddressAutocomplete 
                      value={otherLocation} 
                      onChange={setOtherLocation} 
                    />
                </div>
                )}

                <div style={{ gridArea: 'max_members' }}>
                  <label htmlFor="MaxMembers" className="form-label">Qtà partecipanti*</label>
                  <span style={{ fontSize: '12px', marginLeft: '5px', color: 'gray' }}>(max. 10)</span>
                  <input 
                    type="number" 
                    value={max_members} 
                    defaultValue={1}
                    onChange={(e) => {
                      const newValue = Math.min(Math.max(e.target.value, 1), 10);
                      setMaxMembers(newValue);
                    }} 
                    max="10" 
                    required 
                    style={{ height: '20px', border: 'none' }} 
                  />
                </div>


                

                <div  style={{ gridArea: 'tipologia' }}>
                  <label htmlFor="AdType" className="form-label">Tipologia annuncio*</label>
                  <select value={adType} 
                  onChange={(e) => setAdType(e.target.value)} 
                  required 
                  style={{ 
                    height: '24px', 
                    borderStyle: 'none', 
                    padding: '5px',
                    fontSize: '12px',
                    width: '175px'
                  }}>
                    <option value="">Seleziona la tipologia di annuncio</option>
                    <option value="Gruppo studio">Gruppo studio</option>
                    <option value="Ripetizioni">Ripetizioni</option>
                    <option value="Tutoraggio">Tutoraggio</option>
                  </select>            
                </div>

                {adType === 'Ripetizioni' && (
                  <div style={{ gridArea: 'retribuzione', display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="Retribuzione" className="form-label">Tariffa oraria*</label>
                    <input 
                      type="number" 
                      value={rate} 
                      onChange={(e) => setRate(e.target.value)} 
                      placeholder="Retribuzione" 
                      required 
                      style={{ width: '170px', border: 'none', height: '20px'}} 
                    />
                  </div>
                )}


                <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'center'}}>
                  <button className="btn2" type="button" onClick={handleCancel}>Annulla</button>
                  <div style={{ margin: '0 10px' }}></div> 
                  <button className="btn2" type="submit" onClick={handleNewAd}>Pubblica annuncio</button>
                </div>

            </div>
          </div>
          <div className="navbar-bottom">
              <img src={logo} className="App-logo" alt="logo" style={{ width: "60px", height: "auto" }} />
              <p style={{ color:"white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
          </div>
      </div>
    );
}


NewAdPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};
