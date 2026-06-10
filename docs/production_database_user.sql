CREATE USER IF NOT EXISTS 'sikowali_app'@'localhost' IDENTIFIED BY 'ganti_dengan_password_database_yang_kuat';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX
ON SIKOWALI_v1.*
TO 'sikowali_app'@'localhost';

FLUSH PRIVILEGES;
