
function run(process) {
    let windowID = process.PID;
    
    // make window
    new acr.Window("Weather", `
        <div class="centered apps-weather-loading" id="window-${windowID}-weather-loading">
            <h1>Loading...</h1>
        </div>
        <div class="centered apps-weather-has-location" id="window-${windowID}-weather-has-location">
            <h1>Weather</h1>
            <div class="apps-weather-boxes" id="window-${windowID}-weather-boxes"></div>
            <span class="subtitle">
                Weather data provided by <a href="https://open-meteo.com/">Open-Meteo</a>.
            </span>
        </div>
        <div class="centered apps-weather-no-location" id="window-${windowID}-weather-no-location">
            <h1>No location info available</h1>
            <button class="bfull" onclick="appAction(${windowID}, 'update')">
                Give location permissions
            </button>
        </div>
    `, process);

    // update it for the first time
    process.storage = {};
    process.action("update");

}