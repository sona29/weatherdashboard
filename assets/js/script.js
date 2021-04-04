var weatherFormEl = document.querySelector('#weather-form');
var cityName = document.querySelector('#city-name');
var cityInputEl = document.querySelector('#city');


var today = moment();


var formSubmitHandler = function (event) {
    event.preventDefault();      
    var cityName = cityInputEl.value.trim();
    console.log(cityName);
  
    if (cityName) {
      $("#city-name").text(ucwords(cityName));    
      $("#today-date").text(today.format("MM-DD-YYYY"));
      getCurrentWeather(cityName);        
        // cityInputEl.value = '';
    } 
    
    else {
      alert('Please enter a valid city name');
    }
  };

  // apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=ec32f644e87a04b44e029ac50951cad5';


  var getCurrentWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=ec32f644e87a04b44e029ac50951cad5';
    console.log(apiUrl);
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
              console.log(data);
            //   console.log(data.weather[0].main);
            
            $("#temp-data").text('Temp: ' + data.main.temp + '&#730;F');
            $("#humidity-data").text('Humidity: ' + data.main.humidity + '%');
            $('#wind-data').text('Wind: ' + data.wind.speed + 'MPH');
              
              console.log('longitude:'+ data.coord.lon)
              console.log('lat:'+ data.coord.lat)
              var iconcode = data.weather[0].icon;
              var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
              $('#wicon').attr('src', iconurl);
              $('#result-top').show();
            
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
  };

  function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

  weatherFormEl.addEventListener('submit', formSubmitHandler);

