const elements = {
  form: document.getElementById('search'),
  cityInput: document.getElementById('city_name'),
  weather: document.getElementById('weather'),
  loading: document.getElementById('loading'),
  alert: document.getElementById('alert'),
  title: document.getElementById('title'),
  tempValue: document.getElementById('temp_value'),
  tempDescription: document.getElementById('temp_description'),
  tempMax: document.getElementById('temp_max'),
  tempMin: document.getElementById('temp_min'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  tempImg: document.getElementById('temp_img')
};

const apiKey = 'e888260cff84e41ae73ece6a1b99db7b';

elements.form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const cityName = elements.cityInput.value.trim();

  if (!cityName) {
    return showAlert('Digite uma cidade');
  }

  showLoading();
  hideWeather();

  showAlert(`Buscando clima em ${cityName}...`);

  try {

    const apiUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    const response = await fetch(apiUrl);

    const json = await response.json();

    console.log(json);

    if (json.cod == 404) {
      return showAlert('Cidade não encontrada');
    }

    if (json.cod !== 200) {
      return showAlert('Erro ao buscar clima');
    }

    const weatherData = {
      city: json.name,
      country: json.sys.country,
      temp: json.main.temp,
      tempMax: json.main.temp_max,
      tempMin: json.main.temp_min,
      description: json.weather[0].description,
      icon: json.weather[0].icon,
      humidity: json.main.humidity,
      wind: json.wind.speed,
      main: json.weather[0].main
    };

    renderWeather(weatherData);

    changeBackground(weatherData.main);

    showAlert('');

  } catch (error) {

    console.log(error);

    showAlert('Erro ao buscar clima');

  } finally {

    hideLoading();

  }

});

function renderWeather(data) {

  elements.title.innerHTML =
    `${data.city}, ${data.country}`;

  elements.tempValue.innerHTML =
    `${Math.round(data.temp)}<sup>°C</sup>`;

  elements.tempDescription.innerHTML =
    data.description;

  elements.tempMax.innerHTML =
    `${Math.round(data.tempMax)}°C`;

  elements.tempMin.innerHTML =
    `${Math.round(data.tempMin)}°C`;

  elements.humidity.innerHTML =
    `${data.humidity}%`;

  elements.wind.innerHTML =
    `${Math.round(data.wind)} km/h`;

  elements.tempImg.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${data.icon}@2x.png`
  );

  showWeather();

}

function showWeather() {

  elements.weather.classList.remove('hidden');

  setTimeout(() => {

    elements.weather.classList.remove(
      'opacity-0',
      'translate-y-4'
    );

  }, 50);

}

function hideWeather() {

  elements.weather.classList.add(
    'opacity-0',
    'translate-y-4'
  );

  elements.weather.classList.add('hidden');

}

function showLoading() {

  elements.loading.classList.remove('hidden');

}

function hideLoading() {

  elements.loading.classList.add('hidden');

}

function showAlert(message) {

  elements.alert.innerHTML = message;

}

function changeBackground(weatherMain) {

  const body = document.body;

  const baseClasses =
    'min-h-screen flex items-center justify-center p-4 text-white transition-all duration-500';

  const backgrounds = {
    Clear:
      'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-900',

    Clouds:
      'bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900',

    Rain:
      'bg-gradient-to-br from-gray-700 via-slate-800 to-black',

    Drizzle:
      'bg-gradient-to-br from-gray-700 via-slate-800 to-black',

    Thunderstorm:
      'bg-gradient-to-br from-gray-900 via-slate-950 to-black',

    Snow:
      'bg-gradient-to-br from-cyan-100 via-slate-300 to-slate-500',

    Mist:
      'bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800',

    Haze:
      'bg-gradient-to-br from-amber-200 via-orange-400 to-zinc-700',
  };

  const selectedBackground =
    backgrounds[weatherMain] ||
    'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';

  body.className = `${baseClasses} ${selectedBackground}`;
}