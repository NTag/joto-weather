const express = require('express');
const weatherTwoDaysSVG = require('./drawings/weather-two-days');
const app = express();
const port = 3100;

const SUPPORTED_LOCALES = ['en', 'fr'];

app.use(express.static('app/build'));

app.get('/api/svg/weather-two-days', async (req, res) => {
  const { city, date, locale = 'en' } = req.query;
  if (!city || !date) {
    res.status(400).send({ error: 'city and date query parameters are required' });
  }
  if (!SUPPORTED_LOCALES.includes(locale)) {
    res.status(400).send({ error: `locale must be one of ${SUPPORTED_LOCALES.join(', ')}.` });
  }

  const svg = await weatherTwoDaysSVG({ city, date, locale });
  res.set('Content-Type', ' image/svg+xml').send(svg);
});

app.listen(port, () => {
  console.log(`joto-weather backend listening at http://localhost:${port}`);
});
