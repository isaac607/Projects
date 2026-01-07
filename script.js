// ===== ELEMENT SELECTORS (FROM YOUR HTML) =====
const searchInput = document.querySelector('.search-input-wrapper input');
const searchBtn = document.querySelector('.search-btn');

const cityNameEl = document.querySelector('.city-name');
const dateEl = document.querySelector('.current-date');
const tempEl = document.querySelector('.temp-value');

const statCards = document.querySelectorAll('.stat-card .stat-value');

const hourlyItems = document.querySelectorAll('.hourly-item');

// ===== HELPERS =====
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatHour(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });
}

// ===== MAIN FUNCTION =====
async function loadWeather(place) {
  try {
    // --- 1. GEOCODING ---
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert('Location not found');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // --- 2. WEATHER DATA ---
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weather = await weatherRes.json();

    // --- 3. UPDATE HERO ---
    cityNameEl.textContent = `${name}, ${country}`;
    dateEl.textContent = formatDate(new Date());
    tempEl.textContent = Math.round(weather.current_weather.temperature) + '°';

    // --- 4. UPDATE STATS ---
    statCards[0].textContent =
      Math.round(weather.current_weather.temperature) + '°';

    statCards[1].textContent =
      weather.hourly.relativehumidity_2m[0] + '%';

    statCards[2].textContent =
      weather.current_weather.windspeed + ' km/h';

    statCards[3].textContent =
      weather.hourly.precipitation[0] + ' mm';

    // --- 5. UPDATE HOURLY ---
    for (let i = 0; i < hourlyItems.length; i++) {
      const hourText = hourlyItems[i].querySelector('.hour-text');
      const hourTemp = hourlyItems[i].querySelector('.hour-temp');

      hourText.textContent = formatHour(weather.hourly.time[i]);
      hourTemp.textContent =
        Math.round(weather.hourly.temperature_2m[i]) + '°';
    }

  } catch (err) {
    console.error(err);
    alert('Failed to load weather data');
  }
}

// ===== EVENTS =====
searchBtn.addEventListener('click', () => {
  loadWeather(searchInput.value);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    loadWeather(searchInput.value);
  }
});

// ===== INITIAL LOAD =====
loadWeather(searchInput.value);
