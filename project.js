//forming a connection to Open Meteo's API to get information

let weather_data;
let location_data;

const location_details = document.getElementById("location_details");

async function connect_api(latitude, longitude) {
  // getting information from Open Meteo API
  try {
    let response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_mean&hourly=temperature_2m,rain&timezone=Asia%2FSingapore`,
    );
    weather_data = await response.json();
  } catch (err) {
    location_details.textContent = "An error has occured.";
    // throw an error
  }

  // connect to another api to get location information

  try {
    let response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
    );
    location_data = await response.json();
  } catch (err) {
    location_details.textContent = "An error has occured 2.";
  }

  console.log(weather_data);
  location_details.textContent =
    location_data.address.city + ", " + location_data.address.neighbourhood;
  resolve_daily_temperature_data();
  resolve_hourly_data();
}

function get_coordinates(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  connect_api(latitude, longitude);
}

function show_error_geolocation(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      location_details.textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      location_details.textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      location_details.textContent =
        "The request to get user location timed out.";
      break;
  }
}

function resolve_daily_temperature_data() {
  //select all headers
  let temperature_headers = document.querySelectorAll("#daily_temperature th");

  for (let i = 0; i < weather_data.daily.time.length; i++) {
    let header = temperature_headers[i];

    let date = Temporal.PlainDate.from(weather_data.daily.time[i]);
    let temp = weather_data.daily.temperature_2m_mean[i];

    header.textContent = date.toLocaleString("en-SG", { weekday: "long" });
  };

  //select all data fields
  let temperature_values = document.querySelectorAll("#daily_temperature td");

  for (let i = 0; i<(weather_data.daily.temperature_2m_mean.length);i++){
    let value_field = temperature_values[i];

    let temp = weather_data.daily.temperature_2m_mean[i] + weather_data.daily_units.temperature_2m_mean;

    value_field.textContent = temp;
  };
};

function resolve_hourly_data() {
  let table_row = document.querySelector("#hourly_forecast tr");;
  let hourly_rain_row = document.getElementById("hourly_rain")
  let hourly_temp_row = document.getElementById("hourly_temperature");

  let i = 0
  while (weather_data.daily.time[0].slice(0,10) == weather_data.hourly.time[i].slice(0,10)) {

    // handling insertion of time data into hourly row

    let table_header = document.createElement("th");
    table_row.appendChild(table_header);
    let hourly_date = Temporal.PlainDateTime.from(weather_data.hourly.time[i]);
    
    table_header.textContent = hourly_date.toLocaleString("en-SG", {hour:"numeric", hourCycle:"h12"});

    // handling of insertion of hourly rain data into hourly row

    let hourly_rain_data = document.createElement("td")
    hourly_rain_row.appendChild(hourly_rain_data);
    if (weather_data.hourly.rain[i] == 0){
      hourly_rain_data.textContent = "--";
  } else {
      hourly_rain_data.textContent = weather_data.hourly.rain[i];
  };

    // handling of insertion of hourly temperature into hourly row

    let hourly_temp_data = document.createElement("td");
    hourly_temp_row.appendChild(hourly_temp_data)
    hourly_temp_data.textContent = weather_data.hourly.temperature_2m[i];
  


    i += 1;
  };
};


navigator.geolocation.getCurrentPosition(get_coordinates,show_error_geolocation);

// figure how temporal works and how to get the day from the date retrieved from open AI API
// add this to the table and display the values accordingly
// do the same for hourly statistics

// utc time is standard for all, follows greenwich london
// to get local time, you have to minus off / add a constant for each country
// Temporal.PlainDateTime.from(str)
