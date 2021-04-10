var weatherFormEl = document.querySelector('#weather-form');
var cityName = document.querySelector('#city-name');
var cityInputEl = document.querySelector('#city');
var today = moment();

var formSubmitHandler = function (event) {
    event.preventDefault();      
    var cityName = cityInputEl.value.trim();    
  
    if (cityName) {    
      $("#city-name").text(ucwords(cityName));    
      $("#today-date").text(today.format("MM-DD-YYYY"));
      getCurrentWeather(cityName);       
      fiveDayForecast(cityName);      
      displayCity();   
    } 
    
    else {
      alert('Please enter a valid city name');
    }
  };

  // getting current weather
  var getCurrentWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=ec32f644e87a04b44e029ac50951cad5';   
  
    fetch(apiUrl)
      .then(function (response) {      
        
        if (response.ok) {
          response.json().then(function (data) {
            saveCity(city);   
            displayCity();                 
            $("#temp-data").text('Temp: ' + data.main.temp + '°F');
            $("#humidity-data").text('Humidity: ' + data.main.humidity + '%');
            $('#wind-data').text('Wind: ' + data.wind.speed + 'MPH');             
             // to get uvindex
             uvIndex(data.coord.lat,data.coord.lon);
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

  // to make first character uppercase
function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

// function for getting 5 day forecast
var fiveDayForecast = function (city){
  var fURL = 'https://api.openweathermap.org/data/2.5/forecast?q='+ city +'&appid=ec32f644e87a04b44e029ac50951cad5&units=imperial';


fetch(fURL)
      .then(function (response) {
       
        if (response.ok) {
          response.json().then(function (data) {           
            
              var j=0;
              for(var i=0;i<40;i+=8){
                
                $("#forecast-date-"+j).text(data.list[i].dt_txt);
                var iconcode = data.list[i].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
                $('#forecast-icon-'+j).attr('src', iconurl);
                $("#forecast-temp-"+j).text("Temp: " + data.list[i].main.temp +'°F');
                $("#forecast-wind-"+j).text("Wind: " + data.list[i].wind.speed + "MPH");
                $("#forecast-humidity-"+j).text("Humidity: " + data.list[i].main.humidity + "%");        
                j++
              }
            });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

    };

// to display stored cities from local storage
function displayCity(){
var cityStored = JSON.parse(localStorage.getItem("city")) || [];
    if(cityStored.length){
      $('#cities').empty();
      for(i=0;i<cityStored.length;i++){
        // adding button for every stored city
        var cityButton = $('<input/>').attr({
          type:"button",
          id: cityStored[i],
          class: 'btn-block btn-city',
          value: ucwords(cityStored[i])
        });
    $('#cities').append(cityButton);
    $( ".btn-city" ).click(function() {
    var city = $(this).attr('id');
    $("#city-name").text(ucwords(city));    
    $("#today-date").text(today.format("MM-DD-YYYY"));
    getCurrentWeather(city); 
    fiveDayForecast(city);
  });
  }
}
}



function saveCity(city) {  
  // get localStorage parsed, or an empty array if null
  var citySearched = JSON.parse(localStorage.getItem("city")) || [];
  // checking if city is already stored in the array
  if(citySearched.indexOf(city) === -1){
    // push city to it
    citySearched.push(city);
  }
  // write it back to localStorage
  localStorage.setItem('city', JSON.stringify(citySearched)); 
}

// function to get uv index
var uvIndex = function (lat,lon){
  var fURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat +'&lon='+ lon +'&exclude=hourly,daily,minutely&appid=ec32f644e87a04b44e029ac50951cad5';


fetch(fURL)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {           
            
            var uvValue = parseInt(data.current.uvi);
           
            $("#uv-data").text(data.current.uvi);
            if(uvValue<=2){
              $("#uv-data").css('background','#73ad21');
            }
            if(uvValue>2 && uvValue<=5){
              $("#uv-data").css('background','#e6e600');
            }
            if(uvValue>5){
              $("#uv-data").css('background','#FF0000');
            }
              
            });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

    };

    $(document).ready(function(){
      $(".btn-city").click(function() {       
        var city = $(this).attr('id');
        $("#city-name").text(ucwords(city));    
        $("#today-date").text(today.format("MM-DD-YYYY"));
        getCurrentWeather(city); 
        fiveDayForecast(city);
      });
    });

displayCity();

weatherFormEl.addEventListener('submit', formSubmitHandler);



