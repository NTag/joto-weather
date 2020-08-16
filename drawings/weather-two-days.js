const JotoSVG = require('joto-svg');
const {
  faMoon,
  faCloud,
  faSun,
  faCloudRain,
  faCloudSun,
  faCloudMoon,
  faCloudShowersHeavy,
  faBolt,
  faSnowflake,
  faSmog,
} = require('@fortawesome/free-solid-svg-icons');
const moment = require('moment');
const fetch = require('node-fetch');
require('moment/locale/fr');

const codesToIcons = {
  '01d': faSun,
  '01n': faMoon,
  '02d': faCloudSun,
  '02n': faCloudMoon,
  '03d': faCloud,
  '03n': faCloud,
  '04d': faCloud,
  '04n': faCloud,
  '09d': faCloudRain,
  '09n': faCloudRain,
  '10d': faCloudShowersHeavy,
  '10n': faCloudShowersHeavy,
  '11d': faBolt,
  '11n': faBolt,
  '13d': faSnowflake,
  '13n': faSnowflake,
  '50d': faSmog,
  '50n': faSmog,
};

const getForecast = async (city) => {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&APPID=${process.env.OPENWEATHERMAP_API_KEY}`,
  );
  return response.json();
};
const getDayForecast = async (city, date) => {
  const forecast = await getForecast(city);
  const startDate = moment(date).hour(8);
  const endDate = moment(date).hour(22);
  const forecastUseful = forecast.list.filter(
    (item) => moment(item.dt * 1000).isSameOrAfter(startDate) && moment(item.dt * 1000).isSameOrBefore(endDate),
  );
  const temperatures = forecastUseful.map((item) => item.main.feels_like);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);

  return {
    minTemp,
    maxTemp,
    icon: codesToIcons[forecastUseful[1].weather[0].icon],
  };
};

const weatherTwoDaysSVG = async ({ city, date, locale }) => {
  const joto = new JotoSVG();

  const forecast = await getForecast(city);
  if (!forecast.list) {
    return '';
  }

  const forecastToday = forecast.list.filter((item) => moment(item.dt * 1000).isAfter(date)).slice(0, 4);

  moment.locale(locale);

  const formattedDate = moment(date).format('dddd D MMMM');
  joto.addString({
    x: 250 - formattedDate.length * 6,
    y: 0,
    size: 30,
    str: `${city.split(',')[0]}\n${formattedDate}`,
    align: 'center',
  });

  forecastToday.forEach((item, i) => {
    const x = 10 + i * 130;
    joto.addIcon({ x, y: 120, size: 80, icon: codesToIcons[item.weather[0].icon] });
    joto.addString({ x: x + 30, y: 220, size: 16, str: `${Math.round(item.main.feels_like)}°C` });
  });

  const tomorrow = moment(date).add(1, 'day');
  const forecastTomorrow = forecast.list.filter((item) => moment(item.dt * 1000).isAfter(tomorrow)).slice(0, 4);

  const formattedTomorrowDate = moment(tomorrow).format('dddd D MMMM');
  const y = 260;
  joto.addString({
    x: 250 - formattedTomorrowDate.length * 6,
    y,
    size: 30,
    str: `${formattedTomorrowDate}`,
    align: 'center',
  });

  forecastTomorrow.forEach((item, i) => {
    const x = 10 + i * 130;
    joto.addIcon({ x, y: y + 60, size: 80, icon: codesToIcons[item.weather[0].icon] });
    joto.addString({ x: x + 30, y: y + 160, size: 16, str: `${Math.round(item.main.feels_like)}°C` });
  });

  return joto.getSVG();
};

module.exports = weatherTwoDaysSVG;
