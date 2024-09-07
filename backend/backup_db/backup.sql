-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: unilink
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ad`
--

DROP TABLE IF EXISTS `ad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(500) NOT NULL,
  `classroom` varchar(5) DEFAULT NULL,
  `max_members` int(11) NOT NULL,
  `actual_members` int(11) NOT NULL DEFAULT '0',
  `rate` float DEFAULT '-1',
  `subject` varchar(45) NOT NULL,
  `ad_type` varchar(30) DEFAULT NULL,
  `student_email` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `ad_ibfk_1` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad`
--

LOCK TABLES `ad` WRITE;
/*!40000 ALTER TABLE `ad` DISABLE KEYS */;
INSERT INTO `ad` VALUES (3,'Aiutiamoci in matematica finanziaria','Ciao ragazzi, cerco persone con cui studiare e ripassare per l\'esame di questo appello.','2024-07-06','15:00:00','U6','24',5,0,-1,'Economia','Gruppo studio','u.utente1@campus.unimib.it'),(4,'Ripasso pre-esame','Cerco un compagno con cui fare mega ripassone per l\'esame di Diritto privato. Daje che stavolta lo passo!','2024-07-04','09:00:00','RED Feltrinelli, 28, Viale Sabotino, Porta Romana, Municipio 5, Milano, Lombardia, 20135, Italia',NULL,1,1,-1,'Diritto privato','Gruppo studio','u.utente1@campus.unimib.it'),(5,'Confronto appunti','Ciao ragazzi, cerco una persona con cui confrontarmi sugli appunti di Diritto commerciale, ho seguito le lezioni in presenza del prof. Germani','2024-06-28','10:00:00','U4','lab02',1,1,-1,'Diritto commerciale','Gruppo studio','u.utente1@campus.unimib.it'),(6,'Preparazione esame','Ciao! Sono negato con il computer, cerco persona con cui disperarmi e cercare di prepararmi al meglio per l\'esame di idoneità informatica.','2024-07-02','14:00:00','U14','T024',1,0,-1,'Informatica','Gruppo studio','u.utente2@campus.unimib.it');
/*!40000 ALTER TABLE `ad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `subject` varchar(45) NOT NULL,
  `price` float NOT NULL,
  `condition` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `student_email` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'Gestione delle imprese - Edoardo Rossi','Economia ',15,'Nuovo','in vendita','u.utente1@campus.unimib.it'),(2,'Management - F. Perrini','Economia e gestione delle imprese',20,'Buone condizioni','in vendita','u.utente2@campus.unimib.it'),(3,'Organizzazione aziendale - Richard Daft','Economia',15,'Utilizzabile','venduto','u.utente2@campus.unimib.it');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollment` (
  `ad_id` int(11) NOT NULL,
  `student_email` varchar(45) NOT NULL,
  PRIMARY KEY (`ad_id`,`student_email`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `ad` (`id`),
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (4,'u.utente2@campus.unimib.it'),(5,'u.utente2@campus.unimib.it');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generic_notification`
--

DROP TABLE IF EXISTS `generic_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generic_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_email` varchar(45) NOT NULL,
  `message` varchar(300) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `notification_type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `generic_notification_ibfk_1` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generic_notification`
--

LOCK TABLES `generic_notification` WRITE;
/*!40000 ALTER TABLE `generic_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `generic_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ad_id` int(11) NOT NULL,
  `reference_type` varchar(10) NOT NULL,
  `author_email` varchar(45) NOT NULL,
  `notification_type` varchar(20) NOT NULL,
  `student_email` varchar(45) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `message` varchar(300) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `author_email` (`author_email`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`author_email`) REFERENCES `user` (`email`),
  CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,4,'ad','u.utente2@campus.unimib.it','new-subscription','u.utente1@campus.unimib.it','2024-06-03 23:22:36','Ciao! <b>Sara</b> <b>Bianchi</b> (u.utente2@campus.unimib.it) si è iscritto al tuo annuncio <b>Ripasso pre-esame</b>.',0),(2,5,'ad','u.utente2@campus.unimib.it','new-subscription','u.utente1@campus.unimib.it','2024-06-03 23:25:48','Ciao! <b>Sara</b> <b>Bianchi</b> (u.utente2@campus.unimib.it) si è iscritto al tuo annuncio <b>Confronto appunti</b>.',0);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `email` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `birth_year` date NOT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `course_type` varchar(20) NOT NULL,
  `subject_area` varchar(45) NOT NULL,
  `course_year` int(11) NOT NULL,
  `password` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('u.utente1@campus.unimib.it','Mario','Rossi','+3743290866379','2000-01-01','male','triennale','economico statistica',1,'Pass00!!',''),('u.utente2@campus.unimib.it','Sara','Bianchi','+3290866379','2000-01-01','female','magistrale','economico statistica',5,'Pass00!!',''),('u.utente3@campus.unimib.it','Federica','Sala','+3290866379','2000-01-01','female','ciclo_unico','giuridica',5,'Pass00!!','Ciao! Sono una studentessa di giurisprudenza, mi piace studiare in gruppo e confrontarmi con altre persone. Adoro l\'ambiente universitario!!');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waiting_list`
--

DROP TABLE IF EXISTS `waiting_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `waiting_list` (
  `ad_id` int(11) NOT NULL,
  `student_email` varchar(45) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`ad_id`,`student_email`),
  KEY `student_email` (`student_email`),
  CONSTRAINT `waiting_list_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `ad` (`id`),
  CONSTRAINT `waiting_list_ibfk_2` FOREIGN KEY (`student_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waiting_list`
--

LOCK TABLES `waiting_list` WRITE;
/*!40000 ALTER TABLE `waiting_list` DISABLE KEYS */;
INSERT INTO `waiting_list` VALUES (5,'u.utente3@campus.unimib.it',1);
/*!40000 ALTER TABLE `waiting_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-03 23:46:22
