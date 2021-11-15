import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import './js/calculator.js';
import { kelvinTofarenheit } from './js/calculator.js';

function checkAPI(response) {
  if (response === 401) {
    return new Error("API is unauthorized");
  } else {
    return true;
  }
}

$(document).ready(function() {
  $('#LATlocation').click(function() {
    const lat = $('#LAT').val();
    const lon = $('#LON').val();
    $('#LAT').val("");
    $('#LON').val("");

    let request = new XMLHttpRequest();
    // const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;
    
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        try {
          const isAPIWorking = checkAPI(this.status);
          if (isAPIWorking instanceof Error) {
            console.error(isAPIWorking.message);
            throw Error("API is not authorized");
          } else {
            console.log("API is all good!");
          }
        } catch(error) {
          console.error(`The error message is: ${error.message}`);
        }
        if (this.status === 200) {
          const response = JSON.parse(this.responseText);
          getElements(response);
        }
      }
    };



    request.open("GET", url, true);
    request.send();

    function getElements(response) {
      const temp = kelvinTofarenheit(response.current.temp);
      $('.showHumidity').text(`The humidity in ${lat}, ${lon} is ${response.current.humidity}%`);
      $('.showTemp').text(`The temperature in farenheit is ${temp} degrees.`);
    }
  });
});