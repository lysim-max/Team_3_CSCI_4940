CREATE DATABASE  IF NOT EXISTS `capstone_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `capstone_project`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: capstone_project
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `business`
--

DROP TABLE IF EXISTS `business`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business` (
  `ID` int NOT NULL,
  `satisfied` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business`
--

LOCK TABLES `business` WRITE;
/*!40000 ALTER TABLE `business` DISABLE KEYS */;
/*!40000 ALTER TABLE `business` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_list`
--

DROP TABLE IF EXISTS `class_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_list` (
  `ID` int NOT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `class_desc` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `credit_hours` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_list`
--

LOCK TABLES `class_list` WRITE;
/*!40000 ALTER TABLE `class_list` DISABLE KEYS */;
INSERT INTO `class_list` VALUES (1,'Composition I',NULL,'Fall/Spring',3),(2,'Composition II',NULL,'Fall/Spring',3),(3,'Precalculus',NULL,'Fall/Spring',3),(4,'American Government',NULL,'Fall/Spring',3),(5,'Wrld Civ I','This course surveys world history to early modern times.','Fall/Spring',3),(6,'Wrld Civ II','This course surveys world history from early modern times to the present.','Fall/Spring',3),(7,'US Hist I',NULL,'Fall/Spring',3),(8,'US Hist II',NULL,'Fall/Spring',3),(9,'Intro to Programming I',NULL,'Fall',3),(10,'Intro to Programming II',NULL,'Spring',3),(11,'Computer Applications',NULL,'Fall',3),(12,'Fundementals of Speech',NULL,'Fall',3),(13,'Intro to Professional Comm',NULL,'Fall',3),(14,'The Global Village',NULL,'Fall',3),(15,'Calculus I',NULL,'Fall',3),(16,'American Government',NULL,'',3),(17,'World Civ I',NULL,NULL,3),(18,'World Civ II',NULL,NULL,3),(19,'US Hist I',NULL,NULL,3),(20,'US Hist II',NULL,NULL,3),(21,'Assembly Language Prog',NULL,NULL,3),(22,'Discrete Structures in CS',NULL,NULL,3),(23,'Data Structures and Algorithms',NULL,NULL,3),(24,'Ethics in Comp Profession',NULL,NULL,3),(25,'Lifetime Fitness',NULL,NULL,1),(26,'CPR/First Aid',NULL,NULL,2),(27,'Computer Architecture',NULL,NULL,3),(28,'Principles of OS',NULL,NULL,3),(29,'Concepts of Prog Languages',NULL,NULL,3),(30,'Intro to Comp Networks',NULL,NULL,3),(31,'Computer Security',NULL,NULL,3),(32,'Design of OS',NULL,NULL,3),(33,'Software Engineering',NULL,NULL,3),(34,'Intro to Database Systems',NULL,NULL,3),(35,'Des & Anal of Algorithms',NULL,NULL,3),(36,'Cloud Computing',NULL,NULL,3),(37,'Mobile and Distributed Computing',NULL,NULL,3),(38,'Artificial Intelligence',NULL,NULL,3),(39,'Capstone Project',NULL,NULL,3),(40,'Web Design',NULL,NULL,3),(41,'Advanced Web Design',NULL,NULL,3),(42,'Syst Anal Design & Implemt I',NULL,NULL,3),(43,'Info Storage & Retrieval',NULL,NULL,3),(44,'Human Comp Interaction',NULL,NULL,3),(45,'Special Problems in CS',NULL,NULL,3),(46,'Internship',NULL,NULL,3),(47,'Elementary Statistics',NULL,NULL,3),(48,'Calculus II',NULL,NULL,4),(49,'Calculus III',NULL,NULL,4),(50,'Discrete Systems I',NULL,NULL,3),(51,'Differential Equations',NULL,NULL,3),(52,'Scientific Computation',NULL,NULL,3),(53,'Adv Math Modeling',NULL,NULL,3),(54,'Mathematical Statistics',NULL,NULL,3),(55,'Principles of Macroeconomics','This principles of economics course is intended to introduce students to concepts that will enable them to understand and analyze economic aggregates and evaluate economic policies.',NULL,3),(56,'World Literature I','A survey of important works of World Literature from the ancient world to Early Modern period.',NULL,3),(57,'World Literature II','A survey of important works of World Literature from the Neoclassical period to the present.',NULL,3),(58,'British Literature I','A survey of important works of British Literature from the Anglo-Saxon period to the Augustans.',NULL,3),(59,'British Literature II','A survey of important works of British Literature from the Romantics to the present.',NULL,3),(60,'American Literature I',' survey of important works of American Literature from the Colonial period to the Civil War.',NULL,3),(61,'American Literature II','A survey of important works of American Literature from Reconstruction to the present.',NULL,3),(62,'The African Diaspora','',NULL,3),(63,'Intercultural Studies Seminar',NULL,NULL,3),(64,'Introduction to Leadership',NULL,NULL,3),(65,'FDNS of Information Literacy',NULL,NULL,3),(66,'Intro to Global Issues',NULL,NULL,3),(67,'Intro to Psychology',NULL,NULL,3),(68,'The World and Its Peoples',NULL,NULL,3),(69,'Introduction to Sociology',NULL,NULL,3),(70,'Global Social Justice',NULL,NULL,3),(71,'Perf Skills for Bus and Prof',NULL,NULL,3),(72,'Int Women, Gender, & Sexuality',NULL,NULL,3);
/*!40000 ALTER TABLE `class_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comp_sci`
--

DROP TABLE IF EXISTS `comp_sci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comp_sci` (
  `ID` int NOT NULL,
  `satisfied` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `ID` FOREIGN KEY (`ID`) REFERENCES `class_list` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comp_sci`
--

LOCK TABLES `comp_sci` WRITE;
/*!40000 ALTER TABLE `comp_sci` DISABLE KEYS */;
INSERT INTO `comp_sci` VALUES (1,0),(2,0),(3,0),(4,0),(5,0),(6,0),(7,0),(8,0),(9,0);
/*!40000 ALTER TABLE `comp_sci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `it`
--

DROP TABLE IF EXISTS `it`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `it` (
  `ID` int NOT NULL,
  `satisfied` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `it`
--

LOCK TABLES `it` WRITE;
/*!40000 ALTER TABLE `it` DISABLE KEYS */;
/*!40000 ALTER TABLE `it` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `output`
--

DROP TABLE IF EXISTS `output`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `output` (
  `class_name` varchar(255) DEFAULT NULL,
  `credit_hours` int DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `output`
--

LOCK TABLES `output` WRITE;
/*!40000 ALTER TABLE `output` DISABLE KEYS */;
/*!40000 ALTER TABLE `output` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'capstone_project'
--

--
-- Dumping routines for database 'capstone_project'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-19 22:04:30
