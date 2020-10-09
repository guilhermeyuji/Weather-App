const apiKey = ''; // AccuWeather Api Key


var form = document.querySelector('form');
var resultBox = document.querySelector('.result_area');

if( localStorage['lastCity'] ){
    form.querySelector('input').value = localStorage['lastCity'];
}


form.addEventListener('submit', function(e){
    e.preventDefault();

    var search = form.querySelector('input').value;
    if( search ){

        resultBox.innerHTML = '';
        resultBox.classList.remove('ready');
        resultBox.classList.add('searching');


        var requestCityData = new XMLHttpRequest();
        requestCityData.onreadystatechange = function(){
            if (this.readyState == 4 ) {
                if( this.status == 200 ){
                    var cityData = this.responseText;
                    cityData = JSON.parse(cityData);



                    if( cityData[0]['Key'] ){

                        var requestForecastData = new XMLHttpRequest();
                        requestForecastData.onreadystatechange = function(){
                            if (this.readyState == 4 ) {

                                if( this.status == 200 ){
                                    resultBox.classList.add('ready');
                                    forecastData = JSON.parse(this.responseText);

                                    if( cityData[0]['EnglishName'] && forecastData[0]['IconPhrase'] ){

                                        localStorage.setItem('lastCity', search);

                                        var hour = new Date(forecastData[0]['DateTime']).getHours();
                                        var d = hour > 6 && 18 > hour ? 'day' : 'night';

                                        var result = '<div class="result" d="'+d+'">';
                                            result += '<div class="temperature">'+forecastData[0]['Temperature']['Value']+' °'+forecastData[0]['Temperature']['Unit']+'</div>';
                                            result += '<div class="flexbox">';
                                                result += '<div class="city_data">';
                                                    result += '<div class="city_name">'+cityData[0]['EnglishName']+'<span>'+cityData[0]['Country']['ID']+'</span></div>';
                                                    result += '<div class="city_state">'+forecastData[0]['IconPhrase']+'</div>';
                                                result += '</div>';
                                                result += '<div class="weather-icon" style="background-image: URL(https://developer.accuweather.com/sites/default/files/'+('0' + forecastData[0]['WeatherIcon']).slice(-2)+'-s.png)"></div>';
                                            result += '</div>';
                                        result += '</div>';
                                    
                                        resultBox.innerHTML = result;
                                    }
                                }
                                else{
                                    alert('An error occurred');
                                }

                                resultBox.classList.remove('searching');
                            }
                        };
                        requestForecastData.open('GET', 'http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/'+cityData[0]['Key']+'?apikey='+apiKey+'&details=true');
                        requestForecastData.send();

                    }

                }
                else{
                    alert('An error occurred');
                    resultBox.classList.remove('searching');
                }
            }
        };
        requestCityData.open('GET', 'http://dataservice.accuweather.com/locations/v1/cities/search?apikey='+apiKey+'&q='+search);
        requestCityData.send();
    }


});

