--Procedures base de datos para mini-reto 2.
--Todos los SP están en el mismo orden que los endpoints como documentados en swagger. Cada endpoint llama un SP en la DB.

--Bands
DELIMITER &&
CREATE PROCEDURE getbands()
BEGIN
SELECT * FROM bands;
END &&
DELIMITER;

DELIMITER &&
CREATE PROCEDURE get_band_info(IN b_id INT)
BEGIN
    SELECT * FROM bands WHERE band_id = b_id;
END&&
DELIMITER ;

--Boys
DELIMITER &&
CREATE PROCEDURE getboys()
BEGIN
SELECT * FROM boys;
END &&
DELIMITER;

DELIMITER &&
CREATE PROCEDURE get_boy_info(IN b_id INT)
BEGIN
    SELECT * FROM boys WHERE boy_id = b_id;
END&&
DELIMITER ;


--Playlist
DELIMITER &&
CREATE PROCEDURE create_new_playlist (IN playlist_name VARCHAR(255))
BEGIN
  INSERT INTO playlists (name) VALUES (playlist_name);
END &&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE delete_playlist(IN p_id INT)
BEGIN
    DELETE FROM playlist_bands WHERE playlist_id = p_id;
    DELETE FROM playlists WHERE playlist_id = p_id;
END&&
DELIMITER;

DELIMITER &&
CREATE PROCEDURE update_playlist_name(IN p_id INT, IN new_name VARCHAR(255))
BEGIN
    UPDATE playlists SET name = new_name WHERE playlist_id = p_id;
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE get_playlist_data(IN p_id INT)
BEGIN
    SELECT playlists.*, 
           (SELECT GROUP_CONCAT(bands.band SEPARATOR ', ') 
            FROM playlist_bands 
            JOIN bands ON playlist_bands.band_id = bands.band_id 
            WHERE playlist_bands.playlist_id = p_id) AS band_names,
           (SELECT GROUP_CONCAT(bands.highest_song_vid SEPARATOR ', ') 
            FROM playlist_bands 
            JOIN bands ON playlist_bands.band_id = bands.band_id 
            WHERE playlist_bands.playlist_id = p_id) AS youtube_links,
           (SELECT COUNT(*) 
            FROM playlist_bands 
            WHERE playlist_bands.playlist_id = p_id) AS num_bands
    FROM playlists
    WHERE playlists.playlist_id = p_id;
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE add_band_to_playlist (IN p_id INT, IN b_id INT)
BEGIN
  INSERT INTO playlist_bands (playlist_id, band_id) VALUES (p_id, b_id);
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE remove_band_from_playlist (
  IN p_id INT,
  IN b_id INT
)
BEGIN
  DELETE FROM playlist_bands WHERE playlist_id = p_id AND band_id = b_id;
END &&
DELIMITER ;

--Boys List
DELIMITER &&
CREATE PROCEDURE create_new_boyslist (IN list_name VARCHAR(255))
BEGIN
  INSERT INTO favorite_boys_lists (name) VALUES (list_name);
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE replace_boy_in_list (IN old_boy_id INT, IN new_boy_id INT, IN l_id INT)
BEGIN
  UPDATE list_boys SET boy_id = new_boy_id WHERE list_id = l_id AND boy_id = old_boy_id;
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE delete_favorite_boys_list(IN l_id INT)
BEGIN
    DELETE FROM list_boys WHERE list_id = l_id;
    DELETE FROM favorite_boys_lists WHERE list_id = l_id;
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE update_boy_list_name (
  IN l_id INT,
  IN new_name VARCHAR(255)
)
BEGIN
  UPDATE favorite_boys_lists SET name = new_name WHERE list_id = l_id;
END &&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE get_boys_in_list (
  IN l_id INT
)
BEGIN
  SELECT favorite_boys_lists.name AS list_name, boys.boy_id, boys.name
  FROM list_boys
  INNER JOIN boys ON list_boys.boy_id = boys.boy_id
  INNER JOIN favorite_boys_lists ON list_boys.list_id = favorite_boys_lists.list_id
  WHERE list_boys.list_id = l_id;
END &&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE remove_boy_from_list(
    IN l_id INT,
    IN b_id INT
)
BEGIN
    DELETE FROM list_boys
    WHERE list_id = l_id AND boy_id = b_id;
END&&
DELIMITER ;

DELIMITER &&
CREATE PROCEDURE add_boy_to_list (IN l_id INT, IN b_id INT)
BEGIN
  INSERT INTO list_boys (list_id, boy_id) VALUES (l_id, b_id);
END&&
DELIMITER ;


