
// run

function run(process) {

    let windowID = process.PID;

    // make window
    new acr.Window("Files", `
        <div class="app-files-grid">
            <div class="app-files-navigation button-group horizontal">
                <button id="window-${windowID}-files-navigation-up">&ShortUpArrow;</button>
                <button id="window-${windowID}-files-navigation-back">&ShortLeftArrow;</button>
                <button id="window-${windowID}-files-navigation-forward">&ShortRightArrow;</button>
            </div>
            <div class="app-files-left" id="window-${windowID}-files-locations"></div>
            <div class="app-files-path button-group horizontal" id="window-${windowID}-files-path"></div>
            <div class="app-files-main">
                <table class="app-files-table">
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody id="window-${windowID}-files-table"></tbody>
                </table>
            </div>
        </div>
    `, process);

    // put onclick on arrow navigation buttons
    for(const arrow of ["up", "back", "forward"]) {
        onclick(`window-${windowID}-files-navigation-${arrow}`, () => {
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
        append(`window-${windowID}-files-locations`, `
            <div class="app-files-locations-group button-group vertical" id="window-${windowID}-files-locations-group-${groupI}"></div>
        `);

        // append buttons
        for(const [display, path] of Object.entries(locationGroup)) {
            append(`window-${windowID}-files-locations-group-${groupI}`, `
                <button id="window-${windowID}-files-locations-button-${buttonI}">${display}</button>
            `);
            onclick(`window-${windowID}-files-locations-button-${buttonI}`, () => {
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

    // navigate to starting location
    const location = "location" in process.additionalData? process.additionalData.location: home;
    process.action("navigate-path", {"path": location});

}