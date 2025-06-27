const express = require('express');
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const cors = require('cors');
const { nanoid } = require('nanoid');

const logger = require('./logger'); //custom logger 

const dbpath = path.join(__dirname, 'URLDataBase.db');
let db = null;

app.use(express.json());
app.use(cors());
app.use(logger); 


const initializeDBAndServer = async () => {
  db = await open({
    filename: dbpath,
    driver: sqlite3.Database,
  });

  app.listen(5000, () => {
    console.log('Server is running at http://localhost:5000/');
  });
};

initializeDBAndServer();


app.post('/shorturls', async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const short = shortcode || nanoid(6);
    const createdAt = new Date().toISOString();
    const minutes = validity && !isNaN(validity) ? parseInt(validity) : 30;
    const expiresAt = new Date(Date.now() + minutes * 60000).toISOString();

    await db.run(
      `INSERT INTO urls (longUrl, shortcode, createdAt, expiresAt) VALUES (?, ?, ?, ?)`,
      [url, short, createdAt, expiresAt]
    );

    res.status(201).json({
      shortLink: `http://localhost:5000/${short}`,
      expiry: expiresAt,
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(409).json({ message: 'Shortcode already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});


app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    console.log("Received request for shortcode:", shortcode);

    const url = await db.get(`SELECT * FROM urls WHERE shortcode = ?`, [shortcode]);
    if (!url) {
      console.log("Shortcode not found");
      return res.status(404).send('Shortcode not found');
    }

    if (new Date() > new Date(url.expiresAt)) {
      console.log("Link expired");
      return res.status(410).send('Link expired');
    }

    console.log("Redirecting to:", url.longUrl);

    await db.run(
      `INSERT INTO clicks (shortcode, timestamp, referrer, geo) VALUES (?, ?, ?, ?)`,
      [shortcode, new Date().toISOString(), req.get('Referrer') || '', 'IN']
    );

    res.redirect(url.longUrl);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;

    const url = await db.get(`SELECT * FROM urls WHERE shortcode = ?`, [shortcode]);
    if (!url) return res.status(404).json({ message: 'Shortcode not found' });

    const clicks = await db.all(`SELECT * FROM clicks WHERE shortcode = ?`, [shortcode]);

    res.json({
      originalURL: url.longUrl,
      createdAt: url.createdAt,
      expiry: url.expiresAt,
      totalClicks: clicks.length,
      clickData: clicks.map(c => ({
        timestamp: c.timestamp,
        referrer: c.referrer,
        location: c.geo
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

