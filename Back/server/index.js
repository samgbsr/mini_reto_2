//NOTA: los endpoints del back se encuentran en el mismo orden que en la documentación swagger por legibilidad. 
//BACKEND DESARROLLADO POR SAM GARCÍA A01642317
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'boy_bands'
});

//endpoints BANDS
app.get('/bands', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL getbands()');
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'Bands not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/bands/:bandId', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_band_info(?)', [req.params.bandId]);
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'Band not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//endpoints BOYS
app.get('/boys', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL getboys()');
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'No boys found' });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/boys/:boyId', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_boy_info(?)', [req.params.boyId]);
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'Boy not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//endpoints PLAYLIST
app.post('/playlist', async (req, res) => {
    try {
        const { playlist_name } = req.body;
        if (!playlist_name) {
            res.status(400).json({ error: 'Playlist name is required' });
            return;
        }
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL create_new_playlist(?)', [playlist_name]);
        connection.release();
        if (rows[0].affectedRows === 1) {
            res.status(201).json({ message: 'Playlist created successfully' });
        } else {
            res.status(501).json({ error: 'Failed to create playlist' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/playlist/:playlistId', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL delete_playlist(?)', [playlistId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Playlist not found' });
        } else {
            res.sendStatus(204);
            res.json({ message: 'Playlist deleted successfully' });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

app.patch('/playlist/:playlistId', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { new_name } = req.body;
        if (!new_name) {
            res.status(400).json({ error: 'New playlist name is required' });
            return;
        }
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL update_playlist_name(?, ?)', [playlistId, new_name]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Playlist not found' });
        } else {
            res.status(200).json({ message: 'Playlist updated successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/playlist/:playlistId', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL get_playlist_data(?)', [playlistId]);
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'Playlist not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

app.post('/playlist/:playlistId/:bandId', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { bandId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL add_band_to_playlist(?, ?)', [playlistId, bandId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Playlist or band not found' });
        } else {
            res.status(201).json({ message: 'Band added to playlist successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/playlist/:playlistId/:bandId', async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { bandId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL remove_band_from_playlist(?, ?)', [playlistId, bandId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Playlist or band not found' });
        } else {
            res.sendStatus(204);
            res.json({ message: 'Band removed from list successfully' });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

//endpoints BOYSLIST
app.post('/boyslist', async (req, res) => {
    try {
        const { list_name } = req.body;
        if (!list_name) {
            res.status(400).json({ error: 'List name is required' });
            return;
        }
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL create_new_boyslist(?)', [list_name]);
        connection.release();
        if (rows[0].affectedRows === 1) {
            res.status(201).json({ message: 'List of boys created successfully' });
        } else {
            res.status(501).json({ error: 'Failed to create list' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/boyslist/:listId', async (req, res) => {
    try {
        const { listId } = req.params;
        const { oldBoyId, newBoyId } = req.body;
        if (!oldBoyId || !newBoyId) {
            res.status(400).json({ error: 'Old and new boy IDs are required' });
            return;
        }
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL replace_boy_in_list(?, ?, ?)', [oldBoyId, newBoyId, listId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Boys list or old boy not found' });
            return;
        }
        res.status(200).json({ message: 'Boy replaced successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/boyslist/:listId', async (req, res) => {
    try {
        const { listId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL delete_favorite_boys_list(?)', [listId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Boys list not found' });
        } else {
            res.sendStatus(204);
            res.json({ message: 'Boys list deleted successfully' });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

app.patch('/boyslist/:listId', async (req, res) => {
    try {
        const { listId } = req.params;
        const { new_name } = req.body;
        if (!new_name) {
            res.status(400).json({ error: 'New list name is required' });
            return;
        }
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL update_boy_list_name(?, ?)', [listId, new_name]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Boys list not found' });
        } else {
            res.status(200).json({ message: 'Boys list name updated successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/boyslist/:listId', async (req, res) => {
    try {
        const { listId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL get_boys_in_list(?)', [listId]);
        connection.release();
        if (rows[0].length === 0) {
            res.status(404).json({ error: 'List not found' });
        } else {
            res.status(200).json(rows[0]);
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

app.delete('/boyslist/:listId/:boyId', async (req, res) => {
    try {
        const { listId } = req.params;
        const { boyId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL remove_boy_from_list(?, ?)', [listId, boyId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Boys list or boy not found' });
        } else {
            res.sendStatus(204);
            res.json({ message: 'Boy removed successfully' });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500).json({ error: 'Internal server error' });
    }
});

app.post('/boyslist/:listId/:boyId', async (req, res) => {
    try {
        const { listId } = req.params;
        const { boyId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL add_boy_to_list(?, ?)', [listId, boyId]);
        connection.release();
        if (rows[0].affectedRows === 0) {
            res.status(404).json({ error: 'Boys list or boy not found' });
        } else {
            res.status(201).json({ message: 'Boy added to list successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//LISTEN
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});