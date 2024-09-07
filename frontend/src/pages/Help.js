import PropTypes from 'prop-types';
import React, { useState } from "react";
import Navbar from "./Navbar";
import logo from "../images/UniLink.png";
import { FcSettings } from "react-icons/fc";


/**
 * This page represents the help section of the UniLink application, providing users with guidance
 * on various features and functionalities available within the platform. It offers explanations
 * and instructions on how to use different sections such as posting announcements, making reservations,
 * and accessing personal areas. Each section can be toggled for more detailed information,
 * providing a comprehensive guide to users.
 */
export default function HelpPage({ isLoggedIn, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sections, setSections] = useState({
    areaPersonale: false,
    pubblicazioneAnnunci: false,
    prenotazioni: false
  }); 

  const handleSectionToggle = (sectionName) => {
    setSections({
      ...sections,
      [sectionName]: !sections[sectionName] 
    });
  };

  return (
    <div style={{ 
      backgroundColor: "rgba(208, 218, 253, 0.3)",
      minHeight: "100vh", 
      paddingBottom: "60px" 
    }}>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
      />
      <div className="help-content">
        <div className="sidebar">
          <h2>Sezioni</h2>
          <ul>
          <div style={{ fontSize: "20px" }}>Per usufruire di tutti i servizi offerti, ti invitiamo a iscriverti ed effettuare il login.</div>
          <li onClick={() => handleSectionToggle("pubblicazioneAnnunci")}>
            <div style={{ fontSize: "20px" , textDecoration: "underline" }}>
              {sections.pubblicazioneAnnunci} Pubblicazioni
            </div>
            {sections.pubblicazioneAnnunci && (
              <ul>
                <li>Vendita di un libro</li>
                <p>Per vendere un libro è necessario inserire le seguenti informazioni:</p>
                <ul>
                  <li>Titolo</li>
                  <li>Materia</li>
                  <li>Prezzo</li>
                  <li>Condizione</li>
                </ul>
                <p></p>
                <p></p>
                <li>Pubblicazione di un annuncio</li>
                <p>Per pubblicare un annuncio è necessario inserire le seguenti informazioni:</p>
                <ul style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  <li>Titolo</li>
                  <li>Descrizione</li>
                  <li>Data</li>
                  <li>Ora</li>
                  <li>Luogo</li>
                  <li>Aula</li>
                  <li>Quantità di partecipanti massimo</li>
                  <li>Materia</li>
                  <li>Tipologia di annuncio</li>
                  <li>Prezzo (nel caso di un annuncio di ripetizioni)</li>
                </ul>
              </ul>
            )}
          </li>


          <li onClick={() => handleSectionToggle("prenotazioni")}>
            <div style={{fontSize: "20px", textDecoration: "underline" }}>
              {sections.prenotazioni} Prenotazioni
            </div>
            {sections.prenotazioni && (
              <ul>
                <li>Prenotazione di un annuncio</li>
                <p>
                  Per prenotare un posto in un annuncio, bisogna cliccare su <em>&quot;ISCRIVIMI&quot;</em>. Una volta cliccato, l&apos;autore dell&apos;annuncio verrà notificato. <br />
                  Se sei già iscritto, non avrai più la possibilità di iscriverti ma sull&apos;annuncio verrà indicato <em>&quot;ISCRITTO&quot;</em>. <br />
                  È possibile gestire le proprie iscrizioni cliccando sull&apos;icona di gestione <FcSettings size={24} />, che porta alla pagina personale degli incontri prenotati. <br />
                  Se non ci sono posti disponibili, è possibile mettersi in lista d&apos;attesa cliccando su <em>&quot;ENTRA IN LISTA D&apos;ATTESA&quot;</em>: nel caso in cui si liberi un posto, verrai iscritto e notificato. <br />
                  Se sei già iscritto alla lista d&apos;attesa, sul tasto sarà indicato <em>&quot;IN LISTA D&apos;ATTESA&quot;</em>. 
                  Per monitorare la propria posizione in lista, è possibile cliccare sull&apos;icona di gestione <FcSettings size={24} />, che porta alla pagina personale della lista d&apos;attesa. <br />
                </p>
                <li>Interesse in un libro</li>
                <p>
                  Se sei interessato a un libro, è possibile cliccare su <em>&quot;MI INTERESSA&quot;</em>; in questo modo, l&apos;autore dell&apos;annuncio verrà notificato. <br />
                  Se l&apos;utente è già stato notificato, sull&apos;annuncio del libro sarà indicato <em>&quot;NOTIFICATO&quot;</em>.
                </p>
              </ul>
            )}
          </li>

          <li onClick={() => handleSectionToggle("areaPersonale")}>
            <div style={{fontSize: "20px", textDecoration: "underline" }}>
              {sections.areaPersonale} Area Personale
            </div>
            {sections.areaPersonale && (
              <ul>
                <li>Notifiche</li>
                <p>
                  Questa sezione mostra una serie di notifiche nel caso in cui:
                </p>
                <ul>
                  <li>Un utente si iscrive ad uno dei tuoi annunci</li>
                  <li>Un utente è interessato ad un libro che vuoi vendere</li>
                  <li>Una persona si disiscrive dal tuo annuncio</li>
                  <li>Vieni iscritto ad un annuncio in cui eri in lista d&apos;attesa</li>
                  <li>Viene eliminato un annuncio a cui eri interessato</li>
                </ul>
                <li>Profilo</li>
                <p>
                  In questa sezione è possibile visualizzare le proprie informazioni inserite durante la registrazione.
                  Inoltre, è possibile eliminare il proprio profilo e di conseguenza tutti gli annunci pubblicati e le iscrizioni effettuate.
                </p>
                <li>Annunci personali</li>
                <p>
                  In questa sezione vengono visualizzati tutti gli annunci che hai pubblicato, con la possibilità di eliminarne alcuni.
                  Nel caso in cui decidi di eliminare un annuncio, tutti gli iscritti vengono notificati.
                </p>
                <li>Prenotazioni</li>
                <p>
                  In questa sezione vengono visualizzati tutti gli annunci a cui sei iscritto, con la possibilità di disiscriversi.
                </p>
                <li>Libri pubblicati</li>
                <p>
                  In questa sezione vengono visualizzati tutti i libri che hai pubblicato e che sono ancora in vendita.
                  È possibile cambiare lo stato del libro a <em>&quot;VENDUTO&quot;</em> oppure eliminarne l&apos;annuncio.
                </p>
                <li>Libri venduti</li>
                <p>
                  In questa sezione vengono visualizzati tutti i libri che hai pubblicato e che sono stati venduti.
                </p>
                <li>Lista d&apos;attesa</li>
                <p>
                  In questa sezione vengono visualizzati tutti gli annunci a cui sei iscritto in lista d&apos;attesa, con la possibilità di disiscriversi.
                </p>
              </ul>
            )}
          </li>

          </ul>
        </div>
      </div>
      <div style={{ height: "60px" }} />
      <div
        className="navbar-bottom"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#4B4F5C",
          padding: "3px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={logo} className="App-logo" alt="logo" style={{ width: "60px", height: "auto" }} />
        <p style={{ color: "white", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>Creato da Nada Mohamed e Alessia Rubini</p>
      </div>
    </div>
  );
}

HelpPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
