-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema capstone_project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema capstone_project
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capstone_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `capstone_project` ;

-- -----------------------------------------------------
-- Table `capstone_project`.`curriculum_index`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_project`.`curriculum_index` (
  `name` VARCHAR(255) NOT NULL,
  `ID` INT NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_project`.`class_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_project`.`class_list` (
  `ID` INT NOT NULL,
  `class_name` VARCHAR(255) NULL,
  `class_desc` VARCHAR(255) NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_project`.`comp_sci`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_project`.`comp_sci` (
  `ID` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `classes` INT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_project`.`crim_jus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_project`.`crim_jus` (
  `ID` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
