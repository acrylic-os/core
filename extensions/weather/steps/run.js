
function run(process) {
    let windowID = process.PID;
    
    // make window
    new acr.Window(acr.msg("weather/name"), `
        <div class="centered apps-weather-loading" id="window-${windowID}-weather-loading">
            <h1>${acr.msg("core/loading")}</h1>
        </div>
        <div class="centered apps-weather-has-location" id="window-${windowID}-weather-has-location">
            <h1>${acr.msg("weather/name")}</h1>
            <div class="apps-weather-boxes" id="window-${windowID}-weather-boxes"></div>
            <span class="subtitle">
                ${acr.msg("weather/source")}
            </span>
        </div>
        <div class="centered apps-weather-no-location" id="window-${windowID}-weather-no-location">
            <h1>${acr.msg("weather/no-location-info")}</h1>
            <button class="bfull" onclick="appAction(${windowID}, 'update')">
                ${acr.msg("weather/give-location-info")}
            </button>
        </div>
    `, process);

    // update it for the first time
    process.storage = {};
    process.action("update");

}