import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import logo from '../images/UniLink.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import { IoKeyOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { PiGenderIntersex } from "react-icons/pi";
import { GoBook } from "react-icons/go";
import { FaArrowsSpin  } from "react-icons/fa6";
import { GiLevelEndFlag } from "react-icons/gi";
import { MdOutlineEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineDescription } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import '../App.css';

import Navbar from './Navbar';

/**
 * 
 * This page consists of the user's profile in the UniLink application, where logged-in users can view
 * their personal information. It includes various fields related to the user's personal
 * and academic details, with an option to toggle the visibility of sensitive information like passwords.
 * In addition, there is functionality that allows the user to delete their profile
 * 
 */
export default function ProfilePage({ isLoggedIn, handleLogout }) {
    const [profileData, setProfileData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [ setUserEmail ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/profile', {
            withCredentials: true
        })
        .then(response => {
            setProfileData(response.data);
        })
    }, []);

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

      const customAlert = (message, type = 'info') => {
        const alertBox = document.createElement('div');
        alertBox.className = `custom-alert ${type}`;
        alertBox.textContent = message;
      
        document.body.appendChild(alertBox);
      
        setTimeout(() => {
            alertBox.remove();
        }, 4000);
      };

      function handleDelete() {
        customConfirm("Sei sicuro di voler eliminare il tuo profilo?", () => {
          axios.delete(`http://127.0.0.1:5000/delete-profile`, { withCredentials: true })
            .then(() => {
              customAlert("Profilo eliminato con successo!", 'success');
              handleLogout();  // This function should already set isLoggedIn to false
              navigate("/login");
            })
            .catch(error => {
              customAlert("Errore nell'eliminazione del profilo: " + error.response.data.error, 'error');
            });
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

    const formatBirthdate = (birthdate) => {
        return new Date(birthdate).toLocaleDateString();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const videoRef = useRef(null);
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.25;
      }
    }, []);

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


            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <video 
                    autoPlay 
                    muted 
                    ref={videoRef}
                    style={{ position: "absolute", 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    zIndex: "-1",
                    opacity: "0.8"}}>
                    <source src="https://videos.pexels.com/video-files/4779866/4779866-hd_1920_1080_30fps.mp4" />
                </video>
                <div style={{ width: '400px', margin: 'auto'}}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                padding: '20px', borderRadius: '0', 
                                border: '2px solid #4B4F5C', marginTop: '60px' }}>
                        <div style={{ marginTop: '10px', marginBottom: '20px', position: "center" }}>
                        <p><strong><FiUser />   Nome:</strong> {profileData?.first_name || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                        <p><strong><FiUser />   Cognome:</strong> {profileData?.last_name || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                        <p><strong><MdOutlineEmail />   Email:</strong> {profileData?.email || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                        <p><strong><BsTelephone />   Numero di telefono:</strong> {profileData?.phone_number || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                        <p><strong><IoKeyOutline />   Password:</strong>  
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={profileData?.password || ''} 
                                    readOnly
                                    style={{ marginRight: '5px', width: '200px', background: 'none', border: 'none' }} 
                                />
                                {showPassword ? 
                                    <FaEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} /> :
                                    <FaEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                                }
                            </p>                       
                            <p><strong><CiCalendar />   Data di nascita:</strong> {profileData?.birth_year ? formatBirthdate(profileData.birth_year) : <span style={{ color: 'gray', fontStyle: 'italic' }}>non indicato</span>}</p>
                            <p>
                            <strong><PiGenderIntersex /> Sesso:</strong> {
                                profileData?.gender === "male" ? "Maschio" :
                                profileData?.gender === "female" ? "Femmina" :
                                profileData?.gender === "not_specified" ? "Preferisco non specificare" :
                                <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>
                            }
                            </p>
                            <p><strong><FaArrowsSpin  />   Tipologia di corso:</strong> {profileData?.course_type || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                            <p><strong><GoBook />   Area disciplinare:</strong> {profileData?.subject_area || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                            <p><strong><GiLevelEndFlag />   Anno di corso:</strong> {profileData?.course_year || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                            <p><strong><MdOutlineDescription />   Descrizione:</strong> {profileData?.description || <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '13px' }}>non indicato</span>}</p>
                            <button className="btnDelete2" onClick={() => handleDelete()}>ELIMINA IL MIO PROFILO</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbar-bottom" style={{ backgroundColor: "#4B4F5C", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                <img src={logo} className="App-logo" alt="logo" style={{ width: "60px", height: "auto" }} />
                <p style={{ color:"white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
            </div>
        </div>
    );
}

ProfilePage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    handleLogin: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired
};
