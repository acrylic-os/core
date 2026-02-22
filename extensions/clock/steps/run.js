
function run(process) {

    let windowID = process.PID;

    // spawn window
    new acr.Window(acr.msg("clock/name"), `
        <section class="app-clock-top">
            <div class="button-group horizontal app-clock-top-buttons">
                <button id="window-${windowID}-clock-buttons-analog">${acr.msg("clock/analog")}</button>
                <button id="window-${windowID}-clock-buttons-digital">${acr.msg("clock/digital")}</button>
            </div>
        </section>
        <section id="window-${windowID}-clock-analog" class="app-clock-analog">
            <div class="app-clock-analog-face">
                <div class="app-clock-analog-hand app-clock-analog-hand-1" id="window-${windowID}-clock-analog-hand-1"></div>
                <div class="app-clock-analog-hand app-clock-analog-hand-2" id="window-${windowID}-clock-analog-hand-2"></div>
                <div class="app-clock-analog-hand app-clock-analog-hand-3" id="window-${windowID}-clock-analog-hand-3"></div>
                <div class="app-clock-analog-dot"></div>
            </div>
        </section>
        <section id="window-${windowID}-clock-digital" class="app-clock-digital">
            <span class="app-clock-digital-text">
                <b id="window-${windowID}-clock-digital-text-1"></b><!--
                -->:<!--
                --><b id="window-${windowID}-clock-digital-text-2"></b><!--
                -->:<!--
                --><b id="window-${windowID}-clock-digital-text-3"></b>
            </span>
        </section>
    `, process, ["280px", "370px"]);
    
    // onclick buttons
    onclick(`window-${windowID}-clock-buttons-analog`, () => {
        process.action("analog");
    });
    onclick(`window-${windowID}-clock-buttons-digital`, () => {
        process.action("digital");
    });

    // show analog by default
    process.action("analog");

    // update every second
    process.storage["interval"] = setInterval(() => {
        updateClock(process);
    }, 1000);

}