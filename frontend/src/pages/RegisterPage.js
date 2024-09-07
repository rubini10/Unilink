import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import logo from '../images/UniLink.png';
import PhoneInput from 'react-phone-number-input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiEye, FiEyeOff } from 'react-icons/fi';

import '../App.css';

import 'react-phone-number-input/style.css';
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { BsTelephone } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { PiGenderIntersex } from "react-icons/pi";
import { FaArrowsSpin  } from "react-icons/fa6";
import { GoBook } from "react-icons/go";
import { GiLevelEndFlag } from "react-icons/gi";
import { MdOutlineDescription } from "react-icons/md";

const customAlert = (message, type = 'info') => {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
      alertBox.remove();
  }, 7000);
};

/**
 * 
 * This page allows users to register for the UniLink platform by providing details such as email, password,
 * first name, last name, phone number, gender, birthdate, course type, subject area, and course year.
 * Users are required to fill out all the mandatory fields marked with an asterisk (*) before registering.
 * 
 * **Custom Functions**:
 * - customAlert: Function to display a custom alert message for a specified duration.
 * - customConfirm: Function to display a custom confirmation dialog box for cancelling the registration.
 * 
 * **Error Messages**:
 * - "Per registrarti correttamente inserisci tutti i campi obbligatori (sono contrassegnati con *).": 
 *   Displayed when the user tries to register without filling out all the required fields.
 * - "Per registrarti è necessario che tu sia maggiorenne. Ricontrolla la data di nascita.": 
 *   Displayed when the user's birthdate indicates they are not of legal age.
 * - "Per registrarti ti occorre una email UNIMIB, che quindi termini con @campus.unimib.it.": 
 *   Displayed when the user enters an email address that does not end with "@campus.unimib.it".
 * - "Per registrarti correttamente la password deve essere lunga almeno 8 caratteri, e deve includere almeno: 
 *    una lettera minuscola, una lettera maiuscola, un numero ed un carattere speciale.": 
 *   Displayed when the user's password does not meet the specified criteria.
 * - "Per registrarti correttamente è necessario che i campi di Password e Conferma password coincidano.": 
 *   Displayed when the password and confirm password fields do not match.
 * - "Per registrarti correttamente, se inserisci il tuo numero di telefono, verifica che sia composto da una 
 *    quantità di numeri compresa tra 7 e 15.": 
 *   Displayed when the user's phone number does not meet the specified length criteria.
 * 
 * **Redirect**:
 * - After successful registration, the user is redirected to the login page ("/login").
 */
export default function RegisterPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [courseType, setCourseType] = useState('');
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [subjectArea, setsubjectArea] = useState('');
    const [courseYear, setCourseYear] = useState('');
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(false);
    const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
    const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
    const [isPhoneNumberInvalid, setIsPhoneNumberInvalid] = useState(false);
    const [birthdate, setBirthdate] = useState(null);
    const [isBirthdateInvalid, setIsBirthdateInvalid] = useState(false);
    const [description, setdescription] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@campus.unimib.it$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|_)[A-Za-z\d\W]{8,}$/;
        return regex.test(password);
    };

    const validatePhoneNumber = (phoneNumber) => {
        return (phoneNumber.length >= 7 && phoneNumber.length <= 15) || phoneNumber.length===0;
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setIsEmailInvalid(!validateEmail(value));
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        setIsPasswordInvalid(!validatePassword(value));
    };

    const handlesubjectAreaChange = (e) => {
        setsubjectArea(e.target.value);
    };
  

    const handleFirstNameChange = (e) => {
        const { value } = e.target;
        setFirstName(value);
        setIsFirstNameInvalid(value === '');
    };

    const handleLastNameChange = (e) => {
        const { value } = e.target;
        setLastName(value);
        setIsLastNameInvalid(value === '');
    };


    const handlePhoneNumberChange = (value) => {
      if (value) {
          setPhoneNumber(value);
          setIsPhoneNumberInvalid(!validatePhoneNumber(value));
      } else {
          // Handle the case when value is undefined
          setPhoneNumber('');
          setIsPhoneNumberInvalid(true);
      }
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setIsConfirmPasswordInvalid(value !== password);
    };

    const handleGenderChange = (e) => {
      setGender(e.target.value);
    };
    

    const validateBirthdate = (birthdate) => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return birthdate <= eighteenYearsAgo;
    };

    const handleBirthdateChange = (date) => {
      setBirthdate(date);
      setIsBirthdateInvalid(!validateBirthdate(date));
    };

    const handleCourseTypeChange = (e) => {
        setCourseType(e.target.value);
    };

    const handleCourseYearChange = (e) => {
        setCourseYear(e.target.value);
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
      customConfirm("Sicuro di non volerti più registrare?", (confirmed) => {
          if (confirmed) {
              navigate("/");
          }
      });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  

    const handleSignup = () => {
      let missingFields = [];
      
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!confirmPassword) missingFields.push('confirm password');
      if (!firstName) missingFields.push('first name');
      if (!lastName) missingFields.push('last name');
      if (!birthdate) missingFields.push('birthdate');
      if (!subjectArea) missingFields.push('subject area');
      if (!courseYear) missingFields.push('course year');
      if (!courseType) missingFields.push('course type');
  
      if (missingFields.length > 0) {
          customAlert("Ciao, piacere di conoscerti! \nPer registrarti correttamente inserisci tutti i campi obbligatori \n(sono contrassegnati con *). \nGrazie!", 'error');
          return;
      }

        if (!validateBirthdate(birthdate)) {
            customAlert("Ciao, piacere di conoscerti! \nPer registrarti è necessario che tu sia maggiorenne. \nRicontrolla la data di nascita. \nGrazie!", 'error');
          return;
        }

        if (!validateEmail(email)) {
          customAlert("Ciao, piacere di conoscerti! \nPer registrarti ti occorre una email UNIMIB, che quindi termini con @campus.unimib.it. \nGrazie!", 'error');
        return;
        }

        if (!validatePassword(password)) {
            customAlert("Ciao, piacere di conoscerti! \nPer registrarti correttamente la password deve essere lunga almeno 8 caratteri, \ne deve includere almeno: una lettera minuscola, una lettera maiuscola, un numero ed un carattere speciale. \nGrazie!", 'error');
            return;
        }

        if (confirmPassword !== password) {
          customAlert("Ciao, piacere di conoscerti! \nPer registrarti correttamente è necessario che i campi di Password e Conferma password coincidano. \nGrazie!", 'error');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
          customAlert("Ciao, piacere di conoscerti! \nPer registrarti correttamente, se inserisci il tuo numero di telefono, verifica che sia composto da una quantità di numeri compresa tra 7 e 15. \nGrazie!", 'error');
            return;
        }

        axios.post('http://127.0.0.1:5000/signup', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            birthdate: birthdate.toISOString(),
            gender: gender,
            courseType: courseType,
            subjectArea: subjectArea,
            courseYear: courseYear,
            description: description,
        })
        .then(function (response) {
            console.log(response);
            navigate("/login");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response.status === 409) {
              customAlert("Ciao, piacere di conoscerti! \nQuesto indirizzo email è già occupato. \nPuoi effettuare il login o procedere con un altro indirizzo email. \nGrazie!", 'warning');
            } else if (error.response.status === 401) {
              customAlert("Ciao, piacere di conoscerti! \nQueste credenziali non sono valide, riprova. \nGrazie!", 'warning');
            }
        });
    };


    return (
      <div>
        <div className="navbar">
          <div>
            <img src={logo} className="App-logo" alt="logo" style={{ width: "100px", height: "auto" }} />
          </div>
          <div>
            <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold"}} >Home</Link>
            <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold"}} >Login</Link>
          </div>
        </div>

        <div className="registration-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div className="registration-form" style={{ maxWidth: '800px', padding: '20px', borderRadius: '0', backgroundColor: 'rgba(0, 0, 0, 0)', border: '2px solid #E684C3', marginTop: '25px' }}>
              <form style={{ marginTop: '10px', display: 'grid', gap: '15px', marginBottom: '20px', position: "center" }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      <MdOutlineEmail style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="email" className="form-label">Email*</label>
                      <input type="email" value={email} onChange={handleEmailChange} id="email" className={`form-control form-control-lg ${isEmailInvalid ? 'is-invalid' : ''}`} placeholder="e.g. m.rossi4@campus.unimib.it" style={{ width: '200px', height: '20px' }} />
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                      <BsTelephone style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="phoneNumber" className="form-label">Cellulare</label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className={`form-control form-control-lg ${isPhoneNumberInvalid ? 'is-invalid' : ''}`}
                        style={{ width: '200px', height: '20px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      <IoKeyOutline style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="password" className="form-label">Password*</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} id="password" className={`form-control form-control-lg ${isPasswordInvalid ? 'is-invalid' : ''}`} placeholder="Inserisci una password" style={{ width: '180px' , height: '20px'}} />
                        <button onClick={togglePasswordVisibility} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                      <IoKeyOutline style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="confirmPassword" className="form-label">Riscrivi*</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={handleConfirmPasswordChange} id="confirmPassword" className={`form-control form-control-lg ${isConfirmPasswordInvalid ? 'is-invalid' : ''}`} placeholder="Conferma password" style={{ width: '180px', height: '20px' }} />
                        <button onClick={toggleConfirmPasswordVisibility} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      <FiUser style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="firstName" className="form-label">Nome*</label>
                      <input type="text" value={firstName} onChange={handleFirstNameChange} id="firstName" className={`form-control form-control-lg ${isFirstNameInvalid ? 'is-invalid' : ''}`} placeholder="e.g. Mario" style={{ width: '200px', height: '20px' }} />
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                      <FiUser style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="lastName" className="form-label">Cognome*</label>
                      <input type="text" value={lastName} onChange={handleLastNameChange} id="lastName" className={`form-control form-control-lg ${isLastNameInvalid ? 'is-invalid' : ''}`} placeholder="e.g. Rossi" style={{ width: '200px', height: '20px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '200px' }}>
                      <CiCalendar style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="birthdate" className="form-label">Data di nascita*</label>
                      <DatePicker
                        selected={birthdate}
                        onChange={handleBirthdateChange}
                        id="birthdate"
                        className={`form-control form-control-lg ${isBirthdateInvalid ? 'is-invalid' : ''}`}
                        placeholderText="Select your date of birth"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        style={{ width: '200px', height: '20px' }}
                      />
                    </div>
                    <div style={{ maxWidth: '200px' }}>
                      <PiGenderIntersex style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="gender" className="form-label">Genere</label>
                      <select id="gender" className="form-control form-control-lg" value={gender} onChange={handleGenderChange} style={{ width: '200px', height: '20px' }}>
                        <option value="">Seleziona da elenco</option>
                        <option value="male">Maschio</option>
                        <option value="female">Femmina</option>
                        <option value="not_specified">Preferirei non specificare</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      <FaArrowsSpin style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="courseType" className="form-label">Tipologia corso*</label>
                      <select id="courseType" className="form-control form-control-lg" value={courseType} onChange={handleCourseTypeChange} style={{ width: '200px', height: '20px' }}>
                        <option value="">Seleziona da elenco</option>
                        <option value="triennale">Triennale</option>
                        <option value="magistrale">Magistrale</option>
                        <option value="ciclo_unico">Ciclo Unico</option>
                      </select>
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                      <GoBook style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="subjectArea" className="form-label">Area disciplinare*</label>
                      <select id="subjectArea" className="form-control form-control-lg" value={subjectArea} onChange={handlesubjectAreaChange} style={{ width: '200px', height: '20px' }}>
                        <option value="">Seleziona da elenco</option>
                        <option value="economico statistica">Economico-Statistica</option>
                        <option value="scientifica">Scientifica</option>
                        <option value="sociologica">Sociologica</option>
                        <option value="pedagogica">Pedagogica</option>
                        <option value="giuridica">Giuridica</option>
                        <option value="medica">Medica</option>
                        <option value="psicologica">Psicologica</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ maxWidth: '150px' }}>
                      <GiLevelEndFlag style={{ marginRight: '3px', marginBottom: '-3px' }} />
                      <label htmlFor="courseYear" className="form-label">Anno di corso*</label>
                      <select id="courseYear" className="form-control form-control-lg" value={courseYear} onChange={handleCourseYearChange} style={{ width: '200px', height: '20px' }}>
                        <option value="">Seleziona da elenco</option>
                        <option value="1">Primo anno</option>
                        <option value="2">Secondo anno</option>
                        <option value="3">Terzo anno</option>
                        <option value="4">Quarto anno</option>
                        <option value="5">Quinto anno</option>
                      </select>
                    </div>
                    <div></div> 
                  </div>
                  <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <MdOutlineDescription style={{ marginRight: '3px' }} />
                      <label htmlFor="description" className="form-label">Descrizione</label>
                  </div>
                      <textarea
                          value={description}
                          onChange={(e) => setdescription(e.target.value)}
                          placeholder="Inserisci una breve iscrizione"
                          maxLength="200"
                          style={{
                              display: 'block',
                              width: '560px',
                              height: '50',
                              border: '1px solid #767676',
                              padding: '10px',
                              resize: 'vertical'
                          }}
                      />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="button" style={{ marginRight: '10px', padding: '5px 10px', fontSize: '15px' }} className="btn3" onClick={handleCancel}>Annulla</button>
                    <button type="button" style={{ marginRight: '10px', padding: '5px 10px', fontSize: '15px' }} className="btn3" onClick={handleSignup}>Registrati</button>
                  </div>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Hai già un account? <Link to="/login" className="link-danger">Login</Link></p>
                </form>
            </div>
            <div className="registration-video">

              <video autoPlay
                muted 
                loop 
                style={{ width: "100%", height: "80vh", objectFit: "cover", opacity: "0.9" }}>

                <source src="https://videos.pexels.com/video-files/3843427/3843427-hd_1080_2048_25fps.mp4"/>
              </video>
          </div>
        </div>
      {/* Bottom bar */}
      <div className="navbar-bottom">
        <img src={logo} className="App-logo-bottom" alt="logo" style={{ width: "60px", height: "auto" }} />
        <p style={{ color:"white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
      </div>
      </div>
    );
}