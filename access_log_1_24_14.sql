-- MySQL dump 10.13  Distrib 5.1.71, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: geicodb
-- ------------------------------------------------------
-- Server version	5.1.71

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
-- Table structure for table `access_log`
--

DROP TABLE IF EXISTS `access_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `client_id` varchar(255) DEFAULT NULL,
  `log_status` varchar(255) DEFAULT NULL,
  `timestamp` varchar(255) DEFAULT NULL,
  `vendor_id` varchar(255) DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `geico_access` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_log`
--

LOCK TABLES `access_log` WRITE;
/*!40000 ALTER TABLE `access_log` DISABLE KEYS */;
INSERT INTO `access_log` VALUES (1,'1','connected','January 19th 2014, 12:16:06 am',NULL,NULL),(2,'1','connected','January 19th 2014, 12:20:05 am',NULL,NULL),(3,'1','connected','January 19th 2014, 12:22:35 am',NULL,NULL),(4,'1','connected','January 19th 2014, 12:25:42 am',NULL,NULL),(5,'3','connected','January 19th 2014, 12:27:43 am',NULL,NULL),(6,'2','connected','January 19th 2014, 12:28:19 am',NULL,NULL),(7,'2','connected','January 19th 2014, 12:32:42 am',NULL,NULL),(8,'0','connected','January 19th 2014, 12:33:54 am',NULL,NULL),(9,'2','connected','January 19th 2014, 12:34:08 am',NULL,NULL),(10,'2','connected','January 19th 2014, 12:35:10 am',NULL,NULL),(11,'0','connected','January 19th 2014, 12:35:18 am',NULL,NULL),(12,'3','connected','January 19th 2014, 12:35:45 am',NULL,NULL),(13,'5','connected','January 19th 2014, 12:37:39 am',NULL,NULL),(14,'6','connected','January 19th 2014, 12:37:51 am',NULL,NULL),(15,'7','connected','January 19th 2014, 12:38:57 am',NULL,NULL),(16,'0','connected','January 19th 2014, 12:39:02 am',NULL,NULL),(17,'1','connected','January 19th 2014, 12:39:17 am',NULL,NULL),(18,'6','connected','January 19th 2014, 12:39:32 am',NULL,NULL),(19,'0','connected','January 20th 2014, 9:47:54 am',NULL,NULL),(20,'0','connected','January 20th 2014, 9:47:54 am',NULL,NULL),(21,'0','connected','January 20th 2014, 11:21:01 am',NULL,NULL),(22,'6','connected','January 20th 2014, 4:33:19 pm',NULL,NULL),(23,'12','connected','January 20th 2014, 4:56:43 pm',NULL,NULL),(24,'12','connected','January 20th 2014, 5:02:15 pm',NULL,NULL),(25,'12','connected','January 20th 2014, 5:05:19 pm',NULL,NULL),(26,'12','connected','January 20th 2014, 5:07:05 pm',NULL,NULL),(27,'11','connected','January 20th 2014, 5:10:28 pm',NULL,NULL),(28,'11','connected','January 20th 2014, 5:18:01 pm',NULL,NULL),(29,'11','connected','January 20th 2014, 5:20:32 pm',NULL,NULL),(30,'11','connected','January 20th 2014, 10:55:57 pm',NULL,NULL),(31,'111','connected','January 23rd 2014, 11:55:30 am',NULL,NULL),(32,'111','connected','January 23rd 2014, 12:01:04 pm',NULL,NULL),(33,'0','connected','January 23rd 2014, 6:33:01 pm',NULL,NULL),(34,'0','connected','January 23rd 2014, 6:35:26 pm',NULL,NULL),(35,'0','connected','January 23rd 2014, 11:53:02 pm',NULL,NULL),(36,NULL,'Scheduling','January 24th 2014, 11:21:08 am','12345678902','123123123123'),(37,NULL,'Scheduling','January 24th 2014, 11:30:40 am','12345678902','123123123123'),(38,NULL,'Scheduling','January 24th 2014, 11:30:40 am','12345678902','104201021233'),(39,NULL,'Scheduling','January 24th 2014, 11:35:55 am','12345678902','123123123123'),(40,NULL,'Cancellation','January 24th 2014, 11:35:55 am','12345678902','104201021233'),(41,NULL,'Scheduling','January 24th 2014, 11:37:07 am','12345678902','123123123123'),(42,NULL,'Cancellation','January 24th 2014, 11:37:07 am','12345678902','104201021233'),(43,NULL,'Scheduling','January 24th 2014, 11:37:12 am','12345678902','123123123123'),(44,NULL,'Cancellation','January 24th 2014, 11:37:12 am','12345678902','104201021233'),(45,NULL,'Scheduling','January 24th 2014, 11:41:12 am','12345678902','123123123123'),(46,NULL,'Cancellation','January 24th 2014, 11:41:12 am','12345678902','104201021233');
/*!40000 ALTER TABLE `access_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-01-24 11:43:18
