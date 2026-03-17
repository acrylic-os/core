
function run(process) {
    
    let windowID = process.PID;

    new acr.Window(acr.msg("frames/name"), `
        <div class="app-frames-grid">
            <div>
                <input type="text" placeholder="Search or type URL" class="app-frames-url" id="window-${windowID}-url">
            </div>
            <div>
                <button id="window-${windowID}-load">Load</button>
            </div>
            <div class="app-frames-iframe-box">
                <iframe class="app-frames-iframe" id="window-${windowID}-iframe">
            </div>
        </div>
    `, process);

    onclick(`window-${windowID}-load`, () => {
        process.action("load");
    });

}