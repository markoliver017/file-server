USE mydb;
SET FOREIGN_KEY_CHECKS = 0;


CREATE TABLE feedback (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE announcements (
  id INT AUTO_INCREMENT,
  announcement TEXT NOT NULL,
  file_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE roles (
  id INT AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE files (
    id INT AUTO_INCREMENT,
    url TEXT NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    type ENUM('online', 'project') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE users (
  id INT AUTO_INCREMENT,
  blood_type_id INT DEFAULT NULL,
  role_id INT DEFAULT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50) DEFAULT NULL,
  photo_id INT DEFAULT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  civil_status ENUM('single', 'married', 'widowed', 'separated') NOT NULL DEFAULT 'single',
  weight DECIMAL(5,2) NOT NULL,
  health_condition TEXT DEFAULT NULL,
  is_eligible ENUM('eligible', 'not-eligible', 'for verification') NOT NULL DEFAULT 'for verification',
  is_active TINYINT NOT NULL DEFAULT 1,
  contact_number VARCHAR(20) DEFAULT NULL,
  email VARCHAR(250) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  occupation VARCHAR(100) DEFAULT NULL,
  mailing_address TEXT DEFAULT NULL,
  home_address TEXT DEFAULT NULL,
  office_name VARCHAR(100) DEFAULT NULL,
  office_address TEXT DEFAULT NULL,
  zip_code VARCHAR(10) DEFAULT NULL,
  type_of_donor ENUM('replacement', 'volunteer') NOT NULL DEFAULT 'volunteer',
  patient_name VARCHAR(100) DEFAULT NULL,
  relation VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (blood_type_id) REFERENCES blood_types(id) ON DELETE SET NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
  FOREIGN KEY (photo_id) REFERENCES files(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE appointments (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  is_confirmed TINYINT NOT NULL,
  is_attended TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pre_donation_questions (
  id INT AUTO_INCREMENT,
  question TEXT NOT NULL,
  correct_answer TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pre_donation_answers (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  appointment_id INT NOT NULL,
  question_id INT NOT NULL,
  answer TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  FOREIGN KEY (question_id) REFERENCES pre_donation_questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE donations (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  appointment_id INT NOT NULL,
  weight DECIMAL(5,2) DEFAULT NULL,
  blood_pressure VARCHAR(10) DEFAULT NULL,
  pulse_rate INT DEFAULT NULL,
  height DECIMAL(5,2) DEFAULT NULL,
  temp DECIMAL(5,2) DEFAULT NULL,
  general_appearance TEXT,
  skin TEXT,
  heent TEXT,
  bloodbag_number VARCHAR(20) DEFAULT NULL,
  segment_number VARCHAR(20) DEFAULT NULL,
  time_started TIME DEFAULT NULL,
  time_ended TIME DEFAULT NULL,
  phlebotomist VARCHAR(100) DEFAULT NULL,
  ftb VARCHAR(10) DEFAULT NULL,
  method_of_collection ENUM('whole blood', 'apheresis') NOT NULL DEFAULT 'whole blood',
  is_eligible ENUM('eligible', 'not-eligible', 'for verification', 'cancelled') NOT NULL DEFAULT 'for verification',
  remarks TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE notifications (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  sender_id INT DEFAULT NULL,
  notification_date DATE NOT NULL,
  notification_type VARCHAR(50) DEFAULT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE blood_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_type VARCHAR(3) NOT NULL,
    rh_factor ENUM('+', '-') NOT NULL,
    UNIQUE KEY (type, rh_factor)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO blood_types (blood_type, rh_factor) VALUES
('A', '+'), ('A', '-'),
('B', '+'), ('B', '-'),
('AB', '+'), ('AB', '-'),
('O', '+'), ('O', '-');

CREATE TABLE blood_donor_eligibility_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    is_auto TINYINT NOT NULL DEFAULT 0,
    range_start DECIMAL(5,2) DEFAULT NULL,
    range_end DECIMAL(5,2) DEFAULT NULL,
    range_condition ENUM('>', '<', '==', '>=', '<=', '!=') DEFAULT NULL,
    requirement TEXT DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO blood_donor_eligibility_requirements (category, requirement) VALUES
('Age', '18 to 65 years old (16-17 with parental consent)'),
('Weight', 'At least 50 kg (110 lbs)'),
('Blood Pressure', '90/60 mmHg to 140/90 mmHg'),
('Pulse Rate', '60 to 100 beats per minute'),
('Hemoglobin Level', 'Females: ≥ 12.5 g/dL (125 g/L), Males: ≥ 13.5 g/dL (135 g/L)'),
('Health Condition', 'Must be in good health, no cold, flu, cough, or infections in the last 2 weeks'),
('Recent Medical History', 'No major surgery, blood transfusion, or organ transplant in the past 12 months'),
('Dental Procedures', 'No recent dental extraction (must wait at least 3 days)'),
('Sleep', 'At least 6 hours before donation'),
('Alcohol Intake', 'No excessive alcohol intake in the last 24 hours'),
('Tattoo/Piercing/Acupuncture', 'Must wait 12 months after the procedure'),
('High-Risk Activities', 'No history of risky sexual behavior, drug use, or infectious diseases like HIV/AIDS, Hepatitis B/C, malaria, or tuberculosis'),
('For Women', 'Cannot donate if pregnant, breastfeeding, or having a heavy menstrual period'),
('Donation Interval', 'Whole Blood: Every 3 months (males), 4 months (females); Platelet Apheresis: Every 2 weeks (up to 24 times a year)');


SET FOREIGN_KEY_CHECKS = 1;