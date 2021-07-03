
-- Table 'Products'

-- DROP DATABASE IF EXISTS products;
-- CREATE DATABASE products;

USE products;

-- DROP TABLE IF EXISTS Products;

-- CREATE TABLE Products (
--   ID INT NOT NULL AUTO_INCREMENT,
--   Name VARCHAR (255),
--   Slogan TEXT,
--   Prod_Description LONGTEXT,
--   Category VARCHAR (255),
--   Default_Price VARCHAR (255),
--   PRIMARY KEY (ID)
-- );

-- Table 'Product_Styles'
DROP TABLE IF EXISTS Product_Styles;

CREATE TABLE Product_Styles (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR (255),
  Original_Price VARCHAR (255),
  Sale_Price VARCHAR (255),
  Default_Style TINYINT (1),
  Product_ID INT,
  FOREIGN KEY (Product_ID) REFERENCES Products(ID),
  PRIMARY KEY (ID)
);

-- Table 'SKUs'

DROP TABLE IF EXISTS SKUs;

CREATE TABLE SKUs (
  ID INT NOT NULL AUTO_INCREMENT,
  Quantity INTEGER NULL DEFAULT NULL,
  Size VARCHAR (255),
  Style_ID INT,
  Product_ID INT,
  FOREIGN KEY (Style_ID) REFERENCES Product_Styles(ID),
  FOREIGN KEY (Product_ID) REFERENCES Products(ID),
  PRIMARY KEY (ID)
);


-- -- Table 'Photos'

DROP TABLE IF EXISTS Photos;

CREATE TABLE Photos (
  ID INTEGER NOT NULL AUTO_INCREMENT,
  Thumbnail_URL VARCHAR (255),
  URL VARCHAR (255),
  Style_ID INT,
  Product_ID INT,
  FOREIGN KEY (Style_ID) REFERENCES Product_Styles(ID),
  FOREIGN KEY (Product_ID) REFERENCES Products(ID),
  PRIMARY KEY (ID)
);




-- Table 'Related Products'
--
-- DROP TABLE IF EXISTS Related_Products;

CREATE TABLE Related_Products (
  ID INTEGER NOT NULL AUTO_INCREMENT,
  Product_IDs VARCHAR (255),
  PRIMARY KEY (ID)
);

-- Table 'Features'

-- DROP TABLE IF EXISTS Features;

-- CREATE TABLE Features (
--   ID INTEGER NOT NULL AUTO_INCREMENT,
--   Feature VARCHAR (255),
--   Value VARCHAR (255),
--   Product_ID INT,
--   FOREIGN KEY (Product_ID) REFERENCES Products(ID),
--   PRIMARY KEY (ID)
-- );

-- ---
-- Foreign Keys
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Products` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Product_Styles` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `SKUs` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Related Products` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Features` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Products` (`ID`,`Name`,`Slogan`,`Description`,`Category`,`Default_Price`) VALUES
-- ('','','','','','');
-- INSERT INTO `Product_Styles` (`ID`,`Style_Id`,`Name`,`Original_Price`,`Sale_Price`,`Default`,`Product ID FOREIGN KEY`) VALUES
-- ('','','','','','','');
-- INSERT INTO `SKUs` (`ID`,`Style_ID`,`Quantity`,`Size_Num`,`Size_Char`) VALUES
-- ('','','','','');
-- INSERT INTO `Photos` (`ID`,`Thumbnail_URL`,`URL`,`Style_ID FOREIGN KEY`) VALUES
-- ('','','','');
-- INSERT INTO `Related Products` (`ID`,`Product_IDs`) VALUES
-- ('','');
-- INSERT INTO `Features` (`ID`,`Feature`,`Product_ID FOREIGN KEY`) VALUES
-- ('','','');