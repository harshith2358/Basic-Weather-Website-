//forming a connection to Open Meteo's API to get information

let weather_data;
let location_data;

const location_details = document.getElementById("location_details")

async function connect_api(latitude,longitude) {

    // getting information from Open Meteo API
    try{
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&timezone=Asia%2FSingapore`);
        weather_data = await response.json();
        
    }

    catch(err) {
        location_details.textContent = "An error has occured.";
        // throw an error
    };

    // connect to another api to get location information

    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`);
        location_data = await response.json();
    }

    catch(err) {
        location_details.textContent = "An error has occured 2.";
    };

    
    location_details.textContent = location_data.address.city + ', ' + location_data.address.neighbourhood;
}

function get_coordinates(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude

    connect_api(latitude,longitude)
   
}



function show_error_geolocation(error){

    switch(error.code){
        case error.PERMISSION_DENIED:
            location_details.textContent = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            location_details.textContent ="Location information is unavailable."; 
            break;
        case error.TIMEOUT:
            location_details.textContent = "The request to get user location timed out."; 
            break;
    };


};

navigator.geolocation.getCurrentPosition(get_coordinates,show_error_geolocation)
