CREATE DATABASE BOY_BANDS;
USE BOY_BANDS;
CREATE TABLE bands (
  band_id INT PRIMARY KEY AUTO_INCREMENT,
  band VARCHAR(50),
  highest_pos INT,
  highest_pos_date DATE,
  highest_song VARCHAR(50),
  danceSpeed VARCHAR(20),
  featuring_artist VARCHAR(50),
  highest_song_vid VARCHAR(255)
);
CREATE TABLE boys (
  boy_id INT PRIMARY KEY,
  band_id INT,
  name VARCHAR(30),
  dob DATE,
  hair_color VARCHAR(30),
  hair_frosted VARCHAR(3),
  hair_length VARCHAR(20),
  hair_style VARCHAR(30),
  eyes VARCHAR(20),
  facial_hair VARCHAR(20),
  accessories VARCHAR(50),
  top_style VARCHAR(30),
  bottom_style VARCHAR(30),
  height INT,
  instrument VARCHAR(30),
  FOREIGN KEY (band_id) REFERENCES bands(band_id)
);
CREATE TABLE playlists (
  playlist_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255)
);
CREATE TABLE playlist_bands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  playlist_id INT,
  band_id INT,
  FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
  FOREIGN KEY (band_id) REFERENCES bands(band_id)
);
CREATE TABLE favorite_boys_lists (
  list_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255)
);
CREATE TABLE list_boys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  list_id INT,
  boy_id INT,
  FOREIGN KEY (list_id) REFERENCES favorite_boys_lists(list_id),
  FOREIGN KEY (boy_id) REFERENCES boys(boy_id)
);






