
function run(process) {

    let windowID = process.PID;

    // spawn window
    new acr.Window("Logs", `
        <div class="apps-logs-grid">
            <pre class="apps-logs-content" id="window-${windowID}-logs-content"></pre>
            <div>
                <button id="window-${windowID}-logs-button-top">Go to top</button>
                <button id="window-${windowID}-logs-button-bottom">Go to bottom</button>
            </div>
        </div>
    `, process, ["40em", "40em"]);

    // update for the first time
    process.action("update");
    id(`window-${windowID}-logs-content`).scrollTop = id(`window-${windowID}-logs-content`).scrollHeight;

    // onclick buttons
    onclick(`window-${windowID}-logs-button-top`, () => {
        id(`window-${windowID}-logs-content`).scrollTop = 0;
    });
    onclick(`window-${windowID}-logs-button-bottom`, () => {
        id(`window-${windowID}-logs-content`).scrollTop = id(`window-${windowID}-logs-content`).scrollHeight;
    });

    // initialized
    process.storage["initialized"] = true;

}