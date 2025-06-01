

// get location info

function getLocationInfo(process) {
    let windowID = process.PID;

    navigator.geolocation.watchPosition(

        // success
        (position) => {
            process.storage["longitude"] = position.coords.longitude;
            process.storage["latitude"] = position.coords.latitude;
            getWeatherInfo(process);
        },

        // error
        () => {
            id(`window-${windowID}-weather-loading`).style.display = "none";
            id(`window-${windowID}-weather-no-location`).style.display = "block";
        },

        {enableHighAccuracy: true}
    );
}


// get weather info with the location

let weatherInfo;

async function getWeatherInfo(process) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${process.storage["latitude"]}&longitude=${process.storage["longitude"]}&timezone=${timezone}&hourly=temperature_2m,relative_humidity_2m,rain,cloud_cover,uv_index&past_days=1&forecast_days=1`
    );
    if (response.ok) {
        weatherInfo = await response.json();
        process.storage["info_gathered"] = true;
        updateBoxes(process);
    }
}


// update and show boxes

function updateBoxes(process) {
    let windowID = process.PID;

    // get the hourly data
    const hourlyData = weatherInfo["hourly"];

    // put boxes
    id(`window-${windowID}-weather-boxes`).innerHTML = "";
    for (let i = 0; i < Object.keys(hourlyData["time"]).length; ++i) {
        append(`window-${windowID}-weather-boxes`, `
            <a href="#" class="apps-weather-box" id="window-${windowID}-weather-box-${i}">
                <span class="subtitle">
                    ${hourlyData["time"][i].replace("T", "<br>")}
                </span>
                &#x1f321;&#xfe0f; ${hourlyData["temperature_2m"][i]}&deg;C
                <br>
                &#x1f327;&#xfe0f; ${hourlyData["rain"][i]}%
                <br>
                &#x1f4a7; ${hourlyData["relative_humidity_2m"][i]}%
                <br>
                &#x2601;&#xfe0f; ${hourlyData["cloud_cover"][i]}%
                <br>
                &#x2600;&#xfe0f; ${hourlyData["uv_index"][i]}
            </a>
        `);
        onclick(`window-${windowID}-weather-box-${i}`, () => {
            process.action("select_box", { "box": i });
        });
    }

    // remove loading
    id(`window-${windowID}-weather-loading`).style.display = "none";
    id(`window-${windowID}-weather-has-location`).style.display = "block";

    // scroll to center
    id(`window-${windowID}-weather-boxes`).scrollLeft = id(`window-${windowID}-weather-boxes`).offsetWidth * 6;

}


// action

function action(process, action, data) {

    switch (action) {

        // update the weather information
        case "update":
            getLocationInfo(process);
            break;

    }

}