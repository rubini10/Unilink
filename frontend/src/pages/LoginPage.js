import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import logo from '../images/UniLink.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import '../App.css';


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
 * This page allows users to log in to the system. It includes a form for entering email and password.
 * Users can input their credentials and click on "Login" to log in.
 * If they don't have an account, they can click on the "Sign Up" link to be redirected to the signup page.
 * 
 * **Error Messages**:
 * - "Per favore, inserisci l'email e la password.": Displayed when the user tries to login without entering email or password.
 * - "Email o password non validi. Riprova.": Displayed when the server responds with a 401 status code.
 *
 * **Redirect**:
 * - After successful login, the user is redirected to the home page ("/").
 */
export default function LoginPage({ handleLogin }){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setIsEmailInvalid(false);
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        setIsPasswordInvalid(false);
    };

    const handleLoginFunc = () => {
        if (!email || !password) {
            customAlert("Per favore, inserisci l'email e la password.", 'error');
            return;
        }

        axios.post('http://127.0.0.1:5000/login', {
            email: email,
            password: password,
        },{
            withCredentials: true 
        })
        .then(function (response) {
            console.log(response);
            handleLogin();
            navigate("/");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response.status === 401) {
                customAlert("Email o password non validi. Riprova.", 'warning');
            }
        });
    };

    
    const videoRef = useRef(null);
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 4;
      }
    }, []);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    

    return (
      <div>
          <div className="navbar">
              <div>
                  <img src={logo} className="App-logo" alt="logo" style={{ width: "100px", height: "auto" }} />
              </div>
              <div>
                  <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "40px", fontWeight: "bold", fontSize: "16px" }} >Home</Link>
                  <Link to="/signup" style={{ color: "white", textDecoration: "none", marginRight: "20px", fontWeight: "bold", fontSize: "16px" }} >Signup</Link>
              </div>
        </div>

          <div style={{ position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                  <source src="https://videos.pexels.com/video-files/4884232/4884232-hd_1920_1080_30fps.mp4" type="video/mp4" />
              </video>
    
              <div className="login-container">
                <form className="login-form">
                      <div>
                          <MdOutlineEmail style={{ marginRight: '3px', marginBottom: '-3px' }} />
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" value={email} onChange={handleEmailChange} id="email" className={`form-control form-control-lg ${isEmailInvalid ? 'is-invalid' : ''}`} placeholder="Inserisci la tua email" style={{ width: '100%', height: '20px'}} />
                      </div>
                      <div>
                        <IoKeyOutline style={{ marginRight: '3px', marginBottom: '-3px' }} />
                        <label htmlFor="password" className="form-label">Password</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} id="password" className={`form-control form-control-lg ${isPasswordInvalid ? 'is-invalid' : ''}`} placeholder="Inserisci la tua password" style={{ width: '100%', height: '20px'}} />
                            <button onClick={togglePasswordVisibility} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button type="button" style={{ marginRight: '10px', padding: '5px 10px', fontSize: '15px' }} className="btn4" onClick={handleLoginFunc}>Login</button>
                      </div>
                      <p className="small fw-bold mt-2 pt-1 mb-0">Non hai un account? <Link to="/signup" className="link-danger">Registrati</Link></p>
                  </form>
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

LoginPage.propTypes = {
    handleLogin: PropTypes.func.isRequired
};