/**
 * Created by JianSun on 4/17/16.
 */

$(document).ready(function () {
    mainWeather.init();
});

    var mainWeather = {
        init: function () {
            $("#submitWeather").click(function () {
                return mainWeather.getWeather();
            });
        },

        getWeather: function () {
            $.get('http://api.openweathermap.org/data/2.5/weather?q=' + $("#cityInput").val() + "," + $("#countryInput").val() + "&APPID=90218217a5640940a557861baa80b780", function (data) {
                var json = {
                    json: JSON.stringify(data),
                    delay: 1
                };
                echo(json);
            });
        },

        //Prints result from the weatherapi, receiving as param an object
        createWeatherWidg: function (data) {
            return "<div > <p>Temperature: " + (data.main.temp - 273.15).toFixed(2) + " C</p></div>" +
                "<div > <p>Title: " + data.weather[0].main + "</p></div>" +
                "<div > <p>Description: " + data.weather[0].description + "</p></div>" +
                "<div > <p>Wind Speed: " + data.wind.speed + "</p></div>" +
                "<div > <p>Humidity: " + data.main.humidity + "%</p></div>" +
                "<div > <p>Pressure: " + data.main.pressure + " hpa</p></div>";
        }
    };

    var echo = function (dataPass) {
        $.ajax({
            type: "POST",
            url: "/echo/json/",
            data: dataPass,
            cache: false,
            success: function (json) {
                var wrapper = $("#weatherWrapper");
                wrapper.empty();
                wrapper.append("<div class='city'> <p>Place: " + json.name + ", " + json.sys.country + "</p></div>");
                wrapper.append(mainWeather.createWeatherWidg(json));
            }
        });
    };

    mainWeather.init();
