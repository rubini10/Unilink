import React, { useState } from 'react';
import './App.css';
  
import {BrowserRouter, Routes, Route} from 'react-router-dom';
  
import LandingPage from "./pages/HomePage";
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage.js'
import TutoringPage from './pages/TutoringPage.js'
import StudyGroupPage from './pages/StudyGroupPage.js'
import BookShopPage from './pages/BookShopPage.js'
import NewAdPage from './pages/NewAdPage.js'
import NewBookPage from './pages/NewBookPage.js'
import MyProfile from './pages/MyProfile.js'
import PersonalMeeting from './pages/PersonalMeeting.js'
import NotificationsPage from './pages/NotificationsPage.js'
import PersonalBook from './pages/PersonalBook.js'
import PersonalAdsPage from './pages/PersonalAdsPage.js'
import PersonalBookSold from './pages/PersonalBookSold.js'
import PersonalWaitingList from './pages/PersonalWaitingList.js'
import Help from './pages/Help.js'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="vh-100 gradient-custom">
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/tutoring" element={<TutoringPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/study-group" element={<StudyGroupPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/book-shop" element={<BookShopPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/new-ad" element={<NewAdPage isLoggedIn={isLoggedIn}/>} />
          <Route path="/new-book" element={<NewBookPage isLoggedIn={isLoggedIn}/>} />
          <Route path="/my-profile" element={<MyProfile isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/personal-meeting" element={<PersonalMeeting isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/notifications" element={<NotificationsPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/personal-book" element={<PersonalBook isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/personal-book-sold" element={<PersonalBookSold isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/personal-ads" element={<PersonalAdsPage isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/personal-waiting-list" element={<PersonalWaitingList isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
          <Route path="/help" element={<Help isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}
   
export default App;