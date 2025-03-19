CREATE TABLE `sub_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `has_child` varchar(10) NOT NULL DEFAULT 'no',
  `link` varchar(150) DEFAULT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'FaHome',
  `ctr` int NOT NULL DEFAULT 0,
  `created_by` int DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `mod_by` int DEFAULT NULL,
  `mod_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (menu_id) REFERENCES menu(id)
);
