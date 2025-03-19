CREATE TABLE `menu` ( 
`id` int NOT NULL AUTO_INCREMENT,
`name` varchar(150) NOT NULL, `has_child` varchar(3) NOT NULL DEFAULT 'no',
`link` varchar(150) NULL,
`fa_icon` varchar(100) NOT NULL DEFAULT 'FaHome',
`ctr` int NOT NULL DEFAULT 0,
`created_by` int DEFAULT NULL,
`created_date` timestamp NOT NULL DEFAULT current_timestamp(),
`mod_by` int DEFAULT NULL,
`mod_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;