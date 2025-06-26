
// run

function run(process) {

    let windowID = process.PID;

    // make window
    new acr.Window("File picker", `
        <div class="app-file-picker-grid">
            <div class="app-file-picker-navigation button-group horizontal">
                <button id="window-${windowID}-file-picker-navigation-up">&ShortUpArrow;</button>
                <button id="window-${windowID}-file-picker-navigation-back">&ShortLeftArrow;</button>
                <button id="window-${windowID}-file-picker-navigation-forward">&ShortRightArrow;</button>
            </div>
            <div class="app-file-picker-left" id="window-${windowID}-file-picker-locations"></div>
            <div class="app-file-picker-path button-group horizontal" id="window-${windowID}-file-picker-path"></div>
            <div class="app-file-picker-main">
                <table class="app-file-picker-table">
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody id="window-${windowID}-file-picker-table"></tbody>
                </table>
            </div>
        </div>
    `, process);

    // put onclick on arrow navigation buttons
    for(const arrow of ["up", "back", "forward"]) {
        onclick(`window-${windowID}-file-picker-navigation-${arrow}`, () => {
            process.action("navigate-arrow", { "arrow": arrow });
        });
    }

    // make location button info
    const home = `/users/${acr.getUser()}`;
    const locations = [
        {
            "Home": home,
            "Documents": `${home}/Documents`,
            "Downloads": `${home}/Downloads`,
            "Images": `${home}/Images`,
            "Sounds": `${home}/Sounds`,
            "Videos": `${home}/Videos`,
        },
        {
            "Root": "/",
            "Trash": `${home}/Trash`
        }
    ];

    // put location buttons
    let groupI = 0, buttonI = 0;
    for(const locationGroup of locations) {

        // append group
        append(`window-${windowID}-file-picker-locations`, `
            <div class="app-file-picker-locations-group button-group vertical" id="window-${windowID}-file-picker-locations-group-${groupI}"></div>
        `);

        // append buttons
        for(const [display, path] of Object.entries(locationGroup)) {
            append(`window-${windowID}-file-picker-locations-group-${groupI}`, `
                <button id="window-${windowID}-file-picker-locations-button-${buttonI}">${display}</button>
            `);
            onclick(`window-${windowID}-file-picker-locations-button-${buttonI}`, () => {
                process.action("navigate-path", {"path": path});
            });
            ++buttonI;
        }

        ++groupI;

    }

    // set initial path/history data
    process.storage["path"] = "";
    process.storage["history"] = [];
    process.storage["historyCursor"] = 0;

    // navigate to home
    process.action("navigate-path", {"path": home});

}